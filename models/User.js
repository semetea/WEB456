const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const bcrypt=require("bcryptjs");

const userSchema= new Schema({
    fname:String,
    lname:String,
    email:String,
    password:String,
    birthdate:Date,
    type:
    {
            type:String,
            default:"User"
    }
});

userSchema.pre("save",function(next){

    bcrypt.genSalt(10)
    .then(salt=>{
            bcrypt.hash(this.password,salt)
            .then(hash=>{
                    this.password=hash

                    next();
            })
    })
})

const userModel=mongoose.model('User',userSchema);

module.exports=userModel;