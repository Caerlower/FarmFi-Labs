// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title Marketplace
 * @dev A contract for listing and selling goods and services using Cryptograin tokens.
 */
contract Marketplace is Ownable, ReentrancyGuard {
    IERC20 public cryptograinToken;

    // Structure to represent a product or service listing
    struct Listing {
        uint256 id;
        address seller;
        string name;
        string description;
        uint256 price;
        bool active;
    }

    // Structure to represent a purchase order
    struct Order {
        uint256 listingId;
        address buyer;
        uint256 amount;
        bool fulfilled;
        bool refunded;
    }

    // Store all listings
    Listing[] public listings;

    // Store all orders
    mapping(uint256 => Order[]) public orders; // listingId => array of orders

    // Event emitted when a new listing is created
    event ListingCreated(uint256 id, address indexed seller, string name, uint256 price);

    // Event emitted when a product/service is purchased
    event ProductPurchased(uint256 listingId, address indexed buyer, uint256 amount);

    // Event emitted when an order is fulfilled
    event OrderFulfilled(uint256 listingId, address indexed buyer, uint256 amount);

    // Event emitted when an order is refunded
    event OrderRefunded(uint256 listingId, address indexed buyer, uint256 amount);

    /**
     * @dev Constructor to set the Cryptograin token contract address.
     * @param _cryptograinToken Address of the Cryptograin token contract.
     */
    constructor(address _cryptograinToken) {
        cryptograinToken = IERC20(_cryptograinToken);
    }

    /**
     * @dev Create a new product or service listing.
     * @param name Name of the product or service.
     * @param description Description of the product or service.
     * @param price Price of the product or service in Cryptograin tokens.
     */
    function createListing(string memory name, string memory description, uint256 price) external nonReentrant {
        require(price > 0, "Price must be greater than zero");

        listings.push(Listing({
            id: listings.length,
            seller: msg.sender,
            name: name,
            description: description,
            price: price,
            active: true
        }));

        emit ListingCreated(listings.length - 1, msg.sender, name, price);
    }

    /**
     * @dev Purchase a product or service.
     * @param listingId ID of the listing to purchase from.
     * @param amount Amount of the product to purchase (e.g., 1 unit or multiple units).
     */
    function purchaseProduct(uint256 listingId, uint256 amount) external nonReentrant {
        require(listingId < listings.length, "Invalid listing ID");
        Listing memory listing = listings[listingId];
        require(listing.active, "Listing is not active");
        require(amount > 0, "Amount must be greater than zero");

        uint256 totalPrice = listing.price * amount;

        // Transfer Cryptograin tokens from buyer to the contract (escrow)
        cryptograinToken.transferFrom(msg.sender, address(this), totalPrice);

        // Create a new order
        orders[listingId].push(Order({
            listingId: listingId,
            buyer: msg.sender,
            amount: amount,
            fulfilled: false,
            refunded: false
        }));

        emit ProductPurchased(listingId, msg.sender, amount);
    }

    /**
     * @dev Fulfill an order (mark as delivered by the seller).
     * @param listingId ID of the listing to fulfill the order for.
     * @param orderIndex Index of the order in the orders array.
     */
    function fulfillOrder(uint256 listingId, uint256 orderIndex) external nonReentrant {
        require(listingId < listings.length, "Invalid listing ID");
        Listing storage listing = listings[listingId];
        require(msg.sender == listing.seller, "Only the seller can fulfill the order");

        Order storage order = orders[listingId][orderIndex];
        require(!order.fulfilled, "Order has already been fulfilled");

        // Transfer funds from escrow to the seller
        uint256 totalPrice = listing.price * order.amount;
        cryptograinToken.transfer(listing.seller, totalPrice);

        // Mark the order as fulfilled
        order.fulfilled = true;

        emit OrderFulfilled(listingId, order.buyer, order.amount);
    }

    /**
     * @dev Refund an order if not fulfilled.
     * @param listingId ID of the listing to refund the order for.
     * @param orderIndex Index of the order in the orders array.
     */
    function refundOrder(uint256 listingId, uint256 orderIndex) external nonReentrant {
        require(listingId < listings.length, "Invalid listing ID");

        Order storage order = orders[listingId][orderIndex];
        require(msg.sender == order.buyer || msg.sender == owner(), "Only the buyer or owner can request a refund");
        require(!order.fulfilled, "Cannot refund a fulfilled order");
        require(!order.refunded, "Order has already been refunded");

        // Refund the buyer
        uint256 totalPrice = listings[listingId].price * order.amount;
        cryptograinToken.transfer(order.buyer, totalPrice);

        // Mark the order as refunded
        order.refunded = true;

        emit OrderRefunded(listingId, order.buyer, order.amount);
    }

    /**
     * @dev Get the number of listings.
     * @return The total number of listings.
     */
    function getListingCount() external view returns (uint256) {
        return listings.length;
    }

    /**
     * @dev Get the orders for a specific listing.
     * @param listingId ID of the listing to get orders for.
     * @return The array of orders for the listing.
     */
    function getOrdersForListing(uint256 listingId) external view returns (Order[] memory) {
        return orders[listingId];
    }

    /**
     * @dev Deactivate a listing. Only the seller can deactivate their own listing.
     * @param listingId ID of the listing to deactivate.
     */
    function deactivateListing(uint256 listingId) external {
        require(listingId < listings.length, "Invalid listing ID");

        Listing storage listing = listings[listingId];
        require(msg.sender == listing.seller || msg.sender == owner(), "Only the seller or owner can deactivate the listing");

        listing.active = false;
    }
}
