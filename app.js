var bodyParser      = require("body-parser"),
    methodOverride  =require("method-override"),
    expressSanitizer =require("express-sanitizer"),
    mongoose        = require("mongoose"),
    express         = require("express"),
    app             = express();

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect("mongodb://localhost/restful_blog_app");
  

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));


// mongoose/model config
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);



//RESTful ROUTES

// INDEX ROUTE
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("error");
        }
        else{
            res.render("index", {blogs:blogs});
        }
    });
});

app.get("/", function(req, res){
    res.redirect("/blogs");
});

// NEW ROUTE
app.get("/blogs/new", function(req,res){
    res.render("new");
});

// CREATE ROUTE
app.post("/blogs", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(error, newBlog){
        if(error){
            console.log(error);
        }else{
            res.redirect("/blogs");
        }
    });
});

// SHOW ROUTE
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(error, foundBlog){
        if(error){
            console.log(error);
        }else{
            res.render("show", {blog: foundBlog});
        }
    });
});

//EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(error, foundBlog){
        if(error){
            console.log(error);
        }else{
            res.render("edit", {blog: foundBlog});
        }
    });
});

// UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(error, updatedBlog){
        if(error){
            console.log(error);
        }else{
            res.redirect("/blogs/"+ req.params.id);
        }
    });
});

//DELETE ROUTE
app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(error, deletedBlog){
        if(error){
            console.log(error);
        }else{
            res.redirect("/blogs");
        }
    });
});

app.listen(3000, function(){
    console.log("Server is running");
});