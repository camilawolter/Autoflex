package com.factory.resource;

import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.notNullValue;

@QuarkusTest
public class RawMaterialResourceTest {

    @Test
    public void testCreateAndListMaterials() {
        String materialJson = "{\"name\": \"Steel\", \"stockQuantity\": 50}";

        // TEST POST
        given()
          .contentType(ContentType.JSON)
          .body(materialJson)
          .when().post("/materials")
          .then()
             .statusCode(201)
             .body("id", notNullValue())
             .body("name", is("Steel"));

        // TEST GET
        given()
          .when().get("/materials")
          .then()
             .statusCode(200)
             .body("size()", is(notNullValue()));
    }
}