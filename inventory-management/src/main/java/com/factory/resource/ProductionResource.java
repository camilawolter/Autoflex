package com.factory.resource;

import com.factory.entity.Product;
import com.factory.entity.ProductMaterial;
import com.factory.entity.RawMaterial;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Path("/production-suggestion")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ProductionResource {

    /**
     * Inventory-based production suggestion inquiry.
     * Prioritizes higher-value products (Greedy Algorithm).
     */
    @GET
    public ProductionSuggestionDTO suggest() {
        // Search for products sorted by highest price.
        List<Product> products = Product.list("order by price desc");
        
        // Maps current inventory to in-memory simulation.
        List<RawMaterial> allMaterials = RawMaterial.listAll();
        Map<Long, Double> virtualStock = allMaterials.stream()
            .collect(Collectors.toMap(m -> m.id, m -> m.stockQuantity));

        ProductionSuggestionDTO response = new ProductionSuggestionDTO();

        for (Product product : products) {
            int producedCount = 0;
            boolean canProduceMore = true;

            // Try to produce as much of the most expensive product as possible before moving on to the next one.
            while (canProduceMore) {
                for (ProductMaterial pm : product.materials) {
                    double available = virtualStock.getOrDefault(pm.rawMaterial.id, 0.0);
                    if (available < pm.requiredQuantity) {
                        canProduceMore = false;
                        break;
                    }
                }

                if (canProduceMore) {
                    // It consumes the virtual stock of the simulation.
                    for (ProductMaterial pm : product.materials) {
                        virtualStock.put(pm.rawMaterial.id, virtualStock.get(pm.rawMaterial.id) - pm.requiredQuantity);
                    }
                    producedCount++;
                }
            }

            // If you managed to produce at least 1, add it to the DTO.
            if (producedCount > 0) {
                ProductionSuggestionDTO.Item item = new ProductionSuggestionDTO.Item();
                item.productId = product.id;
                item.productName = product.name;
                item.quantity = producedCount;
                item.unitPrice = product.price;
                response.suggestedProducts.add(item);
                
                BigDecimal itemTotal = product.price.multiply(new BigDecimal(producedCount));
                response.totalValue = response.totalValue.add(itemTotal);
            }
        }

        return response;
    }

    /**
     * Endpoint extra to finalize production and accurately reduce inventory.
     */
    @POST
    @Path("/produce/{id}")
    @Transactional
    public Response produce(@PathParam("id") Long id, @QueryParam("quantity") Integer quantity) {
        Product product = Product.findById(id);
        if (product == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        if (quantity == null || quantity <= 0) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Invalid quantity").build();
        }

        // Security check.
        for (ProductMaterial pm : product.materials) {
            double needed = pm.requiredQuantity * quantity;
            if (pm.rawMaterial.stockQuantity < needed) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("Insufficient stock of " + pm.rawMaterial.name).build();
            }
        }

        // Actual Decrease in Stock.
        for (ProductMaterial pm : product.materials) {
            pm.rawMaterial.stockQuantity -= (pm.requiredQuantity * quantity);
        }

        return Response.ok("Production confirmed and stock updated.").build();
    }

    // DTOs for formatting the returned JSON.
    public static class ProductionSuggestionDTO {
        public List<Item> suggestedProducts = new ArrayList<>();
        public BigDecimal totalValue = BigDecimal.ZERO;

        public static class Item {
            public Long productId;
            public String productName;
            public Integer quantity;
            public BigDecimal unitPrice;
        }
    }
}