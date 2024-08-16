// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title IMarketplace
 * @dev Interface for the FarmFi Labs marketplace, allowing users to list, purchase, and manage products and services.
 */
interface IMarketplace {

    /**
     * @dev Emitted when a new listing is created.
     * @param listingId The ID of the listing.
     * @param seller The address of the seller.
     * @param name The name of the listed product or service.
     * @param price The price of the product or service in tokens.
     */
    event ListingCreated(uint256 indexed listingId, address indexed seller, string name, uint256 price);

    /**
     * @dev Emitted when a product or service is purchased.
     * @param listingId The ID of the purchased listing.
     * @param buyer The address of the buyer.
     * @param amount The amount of products or services purchased.
     */
    event ProductPurchased(uint256 indexed listingId, address indexed buyer, uint256 amount);

    /**
     * @dev Emitted when an order is fulfilled by the seller.
     * @param listingId The ID of the listing.
     * @param buyer The address of the buyer.
     * @param amount The amount of products or services fulfilled.
     */
    event OrderFulfilled(uint256 indexed listingId, address indexed buyer, uint256 amount);

    /**
     * @dev Emitted when a refund is processed.
     * @param listingId The ID of the listing.
     * @param buyer The address of the buyer.
     * @param amount The amount refunded.
     */
    event RefundProcessed(uint256 indexed listingId, address indexed buyer, uint256 amount);

    /**
     * @dev Creates a new product or service listing on the marketplace.
     * @param name The name of the product or service.
     * @param description A description of the product or service.
     * @param price The price of the product or service in tokens.
     * @return The ID of the newly created listing.
     */
    function createListing(string memory name, string memory description, uint256 price) external returns (uint256);

    /**
     * @dev Purchases a product or service from the marketplace.
     * @param listingId The ID of the listing to purchase from.
     * @param amount The amount of the product or service to purchase.
     */
    function purchaseProduct(uint256 listingId, uint256 amount) external;

    /**
     * @dev Allows the seller to fulfill an order after the buyer has made the purchase.
     * @param listingId The ID of the listing to fulfill.
     * @param buyer The address of the buyer who purchased the product or service.
     * @param amount The amount of products or services to fulfill.
     */
    function fulfillOrder(uint256 listingId, address buyer, uint256 amount) external;

    /**
     * @dev Allows a buyer to request a refund if the order has not been fulfilled.
     * @param listingId The ID of the listing to request a refund for.
     * @param amount The amount of the product or service to refund.
     */
    function requestRefund(uint256 listingId, uint256 amount) external;

    /**
     * @dev Deactivates a product or service listing. Only the seller or the contract owner can deactivate their own listing.
     * @param listingId The ID of the listing to deactivate.
     */
    function deactivateListing(uint256 listingId) external;

    /**
     * @dev Gets the details of a specific listing by ID.
     * @param listingId The ID of the listing.
     * @return The seller's address, name, description, price, and active status of the listing.
     */
    function getListing(uint256 listingId) external view returns (
        address seller,
        string memory name,
        string memory description,
        uint256 price,
        bool active
    );

    /**
     * @dev Retrieves the number of active listings on the marketplace.
     * @return The total number of active listings.
     */
    function getListingCount() external view returns (uint256);
}
