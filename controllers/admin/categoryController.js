import Category from "../../model/categoryModel"


export const handleGetAllCategories = async (req, res) => {
    try {
        const admin = req.session.admin;
        Category.find({}).lean().exec((err, category) => {
            if (err) {
                res.status(401).redirect('/error');
            } else {
                res.status(202).render('admin/categories', { admin, category })
            }
        })
    } catch (error) {
        res.status(500).redirect('/error')
    }
}

export const handleGetCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        Category.findById(categoryId).lean().exec((err, category) => {
            if (err) {
                res.status(401).json({ message: `Category with ${categoryId}, does not exists` })
            } else {
                res.status(202).json(category);
            }
        })
    } catch (error) {
        res.status(500).redirect('/error')
    }
}

export const handleCreateCategory = async (req, res) => {
    try {
        const newCategory = await Category(req.body);
        const savedCategroy = await newCategory.save();
        res.status(201).json(`Category has been created ${savedCategroy}`);
    } catch (error) {
        if (error.code === 11000) {
            res.status(404).json({ error: `Category ${req.body.name} already exists` })
        } else {
            res.status(500).redirect('/error')
        }
    }
}

export const handleUpdateCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        console.log(categoryId)
        Category.findByIdAndUpdate(categoryId).exec(async (err, category) => {
            if (err) {
                res.status(401).json({ message: 'Somthing went wrong' })
            } else {
                category.name = req.body.name
                category.description = req.body.description
                await category.save()
                res.status(200).json({message:`${category.name} has been updated`});
            }
        })
    } catch (error) {
        res.status(500).redirect('/error')
    }
}

export const handleCategoryStatusChange = async (req, res) => {
    try {
        const categoryId = req.params.id;
        Category.findById(categoryId).exec(async (err, category) => {
            if (err) {
                res.status(402).json({ message: `${categoryId}, Does not exists` });
            } else {
                category.status = !category.status;
                await category.save();
                res.status(202).json({ message: `${category.name}, Status has been changed` })
            }
        })
    } catch (error) {
        res.status(500).redirect('/error')
    }
}

export const hangleDeleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id
        Category.deleteOne({ _id: categoryId }).exec((err) => {
            if (err) {
                res.status(404).json({ message: 'somthing went wrong' });
            } else {
                res.status(202).json({ message: `Category with,${categoryId}, Has been removed` });
            }
        })
    } catch (error) {
        res.status(500).redirect('/error')
    }
}