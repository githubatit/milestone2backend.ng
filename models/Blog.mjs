import mongoose from 'mongoose';

const BlogSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true,
    },

},
{
    timestamps:true,
}
);

const Blog = mongoose.model('Blog', BlogSchema);

export default Blog;