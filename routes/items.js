const { json } = require("express");
const express = require("express");
const router = new express.Router();
const ExpressError = require("../expressError");
const items = require("../fakeDb");

router.get("/", (req, res, next) => {
    try {
        if (items.length === 0) throw new ExpressError("The shopping cart is empty.", 400);
        return res.send(items);
    }
    catch (e) {
        return next (e)
    }
})

router.post("/", (req, res, next) => {
    const newItem = { name: req.body.name, price: req.body.price};
    for (let item of items) {
        if (item.name === newItem.name) throw new ExpressError("Item is already on list", 400);
    }
    try {
        if (!req.body.name) throw new ExpressError("Item name missing", 400);
        else if (!req.body.price) throw new ExpressError("Item price missing", 400);
        items.push(newItem);
        return res.status(201).json({ item: newItem })
    }
    catch (e) {
        return next (e)
    }
})

router.get("/:name", (req, res, next) => {
    const foundItem = items.find(item => item.name === req.params.name);
    try {
        if (!foundItem) throw new ExpressError("Item is not on shopping list", 404);
        res.json({ item: foundItem})
    }
    catch (e) {
        return next (e)
    }
})

router.patch("/:name", (req, res, next) => {
    const editItem = items.find(item => item.name === req.params.name);
    try {
        if (!editItem) throw new ExpressError("Item is not on shopping list", 404);
        editItem.name = req.body.name;
        editItem.price = req.body.price;
        res.json({ item: editItem});
    }
    catch (e) {
        return next (e)
    }
})

router.delete("/:name", (req, res, next) => {
    const deleteItem = items.find(item => item.name === req.params.name);
    try {
        if (!deleteItem) throw new ExpressError("Item is not on shopping list", 404);
        items.splice(deleteItem, 1);
        res.json({ message: "Item deleted." })
    }
    catch (e) {
        return next (e)
    }
})

module.exports = router;