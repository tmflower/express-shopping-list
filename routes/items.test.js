process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../app")
let items = require("../fakeDb")

let popsicle = {name: "popsicle", price: 1.45}
let cheerios = {name: "cheerios", price: 3.40}
let milk = {name: "milk", price: 5.50}

beforeEach(() => {
    items.push(popsicle);
    items.push(cheerios);
    items.push(milk);
});

afterEach (() => {
    items.length = 0;
});

describe("GET /items", () => {
    test("Get list of all items on shopping list", async () => {
        const resp = await request(app).get("/items");
        expect(resp.statusCode).toBe(200);
        expect(resp.body.length).toEqual(3);
    })
})

describe("GET /items/:name", () => {
    test("Get a single item by name", async () => {
        const resp = await request(app).get("/items/cheerios");
        expect(resp.statusCode).toBe(200);
        expect(resp.body.item.name).toEqual("cheerios");
        expect(resp.body.item.price).toEqual(3.40);
    })
})

describe("GET /items/:name", () => {
    test("Responds with 404 if item not found", async () => {
        const resp = await request(app).get("/items/bread");
        expect(resp.statusCode).toBe(404);
    })
})

describe("POST /items", () => {
    test("Add an item to the shopping list", async () => {
        const resp = await request(app).post("/items").send({ name: "cheese", price: 4.45});
        expect(resp.statusCode).toBe(201);
        expect(resp.body.item.name).toEqual("cheese");
    })
})

describe("POST /items", () => {
    test("Responds with 400 if item is already on list", async () => {
        const resp = await request(app).post("/items").send({ name: "milk", price: 5.50});
        expect(resp.statusCode).toBe(400);
    })
})

describe("PATCH /items/:name", () => {
    test("Edit an item on the shopping list", async () => {
        const resp = await request(app).patch("/items/popsicle").send({ name: "popsicle", price: 2.50});
        console.log(resp);
        expect(resp.statusCode).toBe(200);
        expect(resp.body.item.name).toEqual("popsicle");
        expect(resp.body.item.price).toEqual(2.50);
    })
})

describe("PATCH /items/:name", () => {
    test("Responds with 404 if item not on list", async () => {
        const resp = await request(app).patch("/items/hamburgers").send({ name: "hamburgers", price: 19.99});
        expect(resp.statusCode).toBe(404);
    })
})

describe("DELETE /items/:name", () => {
    test("Delete an item from the shopping list", async () => {
        const resp = await request(app).delete("/items/cheerios");
        expect(resp.statusCode).toBe(200);
        expect(resp.body.message).toEqual("Item deleted.")
    })
})

describe("DELETE /items/:name", () => {
    test("Responds with 404 if item not on list", async () => {
        const resp = await request(app).delete("/items/spaghetti");
        expect(resp.statusCode).toBe(404);
    })
})