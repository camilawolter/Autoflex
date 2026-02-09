package com.factory.resource;

import com.factory.entity.Product;
import com.factory.entity.ProductMaterial;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("/products")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ProductResource {

    @GET
    public List<Product> listAll() {
        return Product.listAll();
    }

    @POST
    @Transactional
    public Response create(Product product) {
        product.persist();
        return Response.status(Response.Status.CREATED).entity(product).build();
    }

    @POST
    @Path("/{id}/materials")
    @Transactional
    public Response addMaterial(@PathParam("id") Long id, ProductMaterial association) {
        Product product = Product.findById(id);
        if (product == null) return Response.status(Response.Status.NOT_FOUND).build();
        
        association.product = product;
        association.persist();
        return Response.status(Response.Status.CREATED).entity(association).build();
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    public void delete(@PathParam("id") Long id) {
        Product entity = Product.findById(id);
        if (entity == null) throw new NotFoundException();
        entity.delete();
    }
}