package com.factory.resource;

import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.common.http.TestHTTPEndpoint;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import com.factory.entity.*;
import java.math.BigDecimal;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.is;

@QuarkusTest
@TestHTTPEndpoint(ProductionResource.class)
public class ProductionResourceTest {

    @BeforeEach
    @Transactional
    void setup() {
        // Clean the test bench before each test to avoid interference.
        ProductMaterial.deleteAll();
        Product.deleteAll();
        RawMaterial.deleteAll();

        // Create Raw Material (10 units of Gold).
        RawMaterial gold = new RawMaterial();
        gold.name = "Gold";
        gold.stockQuantity = 10.0;
        gold.persist();

        // Create an expensive product (Ring - $1000 - costs 4 Gold).
        Product ring = new Product();
        ring.name = "Lux Ring";
        ring.price = new BigDecimal("1000.00");
        ring.persist();

        ProductMaterial pm1 = new ProductMaterial();
        pm1.product = ring;
        pm1.rawMaterial = gold;
        pm1.requiredQuantity = 4.0;
        pm1.persist();

        // Create an inexpensive product (Earring - $100 - uses 2 Gold).
        Product earring = new Product();
        earring.name = "Simple Earring";
        earring.price = new BigDecimal("100.00");
        earring.persist();

        ProductMaterial pm2 = new ProductMaterial();
        pm2.product = earring;
        pm2.rawMaterial = gold;
        pm2.requiredQuantity = 2.0;
        pm2.persist();
    }

    @Test
    public void testPrioritizationAlgorithm() {
        /*
           Expected logic:
           We have 10 Gold.
           Priority 1: Lux Ring ($1000) -> Can make 2 units (costs 8 Gold). 2 Gold remaining.
           Priority 2: Simple Earring ($100) -> Can make 1 unit (costs 2 Gold). 0 Gold remaining.
           Suggested Total: 2 Rings + 1 Earring.
        */
        given()
          .when().get()
          .then()
             .statusCode(200)
             .body("suggestedProducts.size()", is(2))
             .body("suggestedProducts.find { it.productName == 'Lux Ring' }.quantity", is(2))
             .body("suggestedProducts.find { it.productName == 'Simple Earring' }.quantity", is(1))
             .body("totalValue", is(2100.0F)); // (2 * 1000) + (1 * 100)
    }
}