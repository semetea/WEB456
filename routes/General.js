const express = require('express');
const router = express.Router();

router.get("/",(req,res)=>{
    res.render("General/index")
});

router.post("/",(req,res)=>{
    const errorsHome = [];
    
    if(req.body.where == "")
    {
        errorsHome.push("Please enter a location");
    }

    if(req.body.checkin == "")
    {
        errorsHome.push("Please enter a check-in date");
    }

    if(req.body.checkout == "")
    {
        errorsHome.push("Please enter a check-out date");
    }

    if(req.body.guest == "")
    {
        errorsHome.push("Please enter a number of guests");
    }

    if(errorsHome.length > 0) {
        res.render("index",{index:errorsHome})
    }

});

router.get("/roomlisting",(req,res)=>{
    res.render("General/roomlisting")
});

module.exports=router;