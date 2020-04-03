const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../helpers/auth');

const compiler = require('compilex');
const options = {stats : true}; //prints stats on console 
compiler.init(options);

let os = require("os"); // Comes with node.js
let opsys = os.platform();
if (opsys == "darwin") {
  os = "MacOS";
} else if (opsys == "win32" || opsys == "win64") {
  os = "windows";
} else if (opsys == "linux") {
  os = "linux";
}


const fs=require('fs');
const path = require('path');

require('../models/fm');
const Explore = mongoose.model('FM');

require('../models/User');
const User = mongoose.model('users');


router.get('/', ensureAuthenticated, (req,res) => {
console.log(req.user.codes)
  res.render('FM/index', {
        FM:req.user.codes
      })
});
// add form
router.get('/add', ensureAuthenticated, (req,res) => {
  res.render('FM/add');
});

// delete form
router.get('/delete/:id', ensureAuthenticated, (req,res) => {
  for(let i=0;i<req.user.codes.length;i++){ 
    if(req.user.codes[i]._id== req.params.id){
        
        req.user.codes.splice(i, 1);
        req.user.save().then(data=>{
          req.flash('success_msg', ' Successfully Deleted');
          res.redirect('/FM');
        }).catch(err=>{console.log(err)});

        break;
    }
  }
       res.redirect('/FM');
});

router.post('/edit/:id', ensureAuthenticated, (req,res) => {
  res.type('html');
  // console.log(req.body)
  if(req.body.action=='save'){
            for(let i=0;i<req.user.codes.length;i++){
              if(req.user.codes[i]._id==req.params.id){
                req.user.codes[i].code=req.body.code;
                req.user.codes[i].details=req.body.details;
                req.user.codes[i].title=req.body.title;
                req.user.codes[i].tags=req.body.tags
                break;                
              }
            }
            req.user.save().then(()=>{
                req.flash('success_msg', 'Saved Successfully');
                res.redirect('/FM');
            })
}

else{
compiler.flush(()=>console.log("FLUSHED"));
let Lan=req.body.language;
    if(Lan=='C'||Lan=='C++'){
      let envData = { OS : os , cmd : "gcc" ,options: {timeout:2000 }}; 
      compiler.compileCPPWithInput(envData , req.body.code , req.body.inputs , function (data) {
if(data.error==data.output){
  res.render('FM/compile', {fm:{
    _id:req.params.id,
    title: req.body.title,
    details: req.body.details,
    code: req.body.code,
    language:"C++",
    inputs:req.body.inputs,
    tags:req.body.tags, 
    output:"Time Limit Exceeded ->2sec",
    type:true
  }}
);}
        if(!data.error)
          {res.render('FM/compile', {fm:{
              _id:req.params.id,
              title: req.body.title,
              details: req.body.details,
              code: req.body.code,
              language:"C++",
              inputs:req.body.inputs,
              tags:req.body.tags, 
              output:data.output,              
              type:false
            }}
          );}

        else
          {res.render('FM/compile', {fm:{
            _id:req.params.id,
            title: req.body.title,
            details: req.body.details,
            code: req.body.code,
            language:"C++",
            inputs:req.body.inputs,
            tags:req.body.tags, 
            output:data.error,
            type:true
          }}
        );}
    });
    }

    else if(Lan=='Py'){
      let envData = { OS : os }; 
      compiler.compilePythonWithInput( envData , req.body.code, req.body.inputs ,  function(data){
       
        if(!data.error)
          {res.render('FM/compile', {fm:{
              _id:req.params.id,
              title: req.body.title,
              details: req.body.details,
              code: req.body.code,
              language:"Py",
              inputs:req.body.inputs,
              tags:req.body.tags, 
              output:data.output,
              type:false
            }}
          );}

      else
        {res.render('FM/compile', {fm:{
          _id:req.params.id,
          title: req.body.title,
          details: req.body.details,
          code: req.body.code,
          language:"Py", 
          inputs:req.body.inputs,
          tags:req.body.tags, 
          output:data.error,
          type:true
        }}
      );}

    });
  }


    else if(Lan=='Jv'){
      let envData = { OS : os }; // (Support for Linux in Next version)
      compiler.compileJavaWithInput( envData , req.body.code , req.body.inputs ,  function(data){
        if(!data.error)
          {res.render('FM/compile', {fm:{
            _id:req.params.id,
            title: req.body.title,
            details: req.body.details,
            code: req.body.code,
            language:"Jv",
            inputs:req.body.inputs,
            tags:req.body.tags, 
            output:data.output,
            type:false
          }}
        );}

    else
      {res.render('FM/compile', {fm:{
        _id:req.params.id,
        title: req.body.title,
        details: req.body.details,
        code: req.body.code,
        language:"Jv", 
        inputs:req.body.inputs,
        tags:req.body.tags, 
        output:data.error,
        type:true
      }}
    );}
      });
    }
}
});

router.get('/visit/:id', ensureAuthenticated, (req,res) => {
  let flag=1;
  for(let i=0;i<req.user.codes.length;i++){
    if(req.user.codes[i]._id==req.params.id){
      flag=0;
      res.render('FM/visit',{fm:req.user.codes[i]});
      break;
    }
  }
  if(flag)
  res.render('FM/NA')
})


router.get('/edit/:id', ensureAuthenticated, (req,res) => {
  let flag=1;
  for(let i=0;i<req.user.codes.length;i++){
    if(req.user.codes[i]._id==req.params.id){
      res.render('FM/compile',{fm:req.user.codes[i]});
      flag=0;
      break;
    }
  }
if(flag)
  res.render('FM/NA');
});

router.get('/share/:id', ensureAuthenticated, (req,res) => {
  let flag=1;
  for(let i=0;i<req.user.codes.length;i++){
    if(req.user.codes[i].title==req.params.id){
        Explore.findOne({title:req.params.id,user:req.user.name}).then(data=>{
          // console.log(data)
          if(data){
            req.flash('error_msg', 'Already Shared');
            res.redirect('/FM/world');
          }
          else{
            const world=new Explore({
              title:req.user.codes[i].title,
              details:req.user.codes[i].details,
              code:req.user.codes[i].code,
              tags:req.user.codes[i].tags,
              user:req.user.name,
            })
            world.save().then(data=>{
              req.flash('success_msg', 'Successfully Shared');
              res.redirect('/FM/world'); 
            })
          }
        });
      flag=0;
      break;
    }
  }
if(flag)
  res.render('FM/NA');
});


router.get('/world', ensureAuthenticated, (req,res) => {
  Explore.find({}).sort({rate:'descending',creationDtae:'descending'}).then(data=>{
  let FM=data;
  for(let j=0;j<FM.length;j++){
    FM[j].me=req.user.name;
  }
  // console.log(FM)
    res.render('FM/world', {
     FM:FM,User:req.user.name
    })
  })
});

router.get('/visit1/:id', ensureAuthenticated, (req,res) => {
  Explore.findOne({_id:req.params.id}).then(data=>{
    if(data.length)
      res.render('FM/error')
      else{
          res.render('FM/visit1',{fm:data});
      }
  })
})

router.post('/compile1/:id', ensureAuthenticated, (req,res) => {
{
compiler.flush(()=>console.log("FLUSHED"));
let Lan=req.body.language;
    if(Lan=='C'||Lan=='C++'){
      let envData = { OS : os , cmd : "gcc" ,options: {timeout:2000 }}; 
      compiler.compileCPPWithInput(envData , req.body.code , req.body.inputs , function (data) {
if(data.error==data.output){
  res.render('FM/visit1', {fm:{
    _id:req.params.id,
    title: req.body.title,
    details: req.body.details,
    code: req.body.code,
    language:"C++",
    inputs:req.body.inputs,
    tags:req.body.tags, 
    output:"Time Limit Exceeded ->2sec",
    type:true
  }}
);}
        if(!data.error)
          {res.render('FM/visit1', {fm:{
              _id:req.params.id,
              title: req.body.title,
              details: req.body.details,
              code: req.body.code,
              language:"C++",
              inputs:req.body.inputs,
              tags:req.body.tags, 
              output:data.output,              
              type:false
            }}
          );}
        else
          {res.render('FM/visit1', {fm:{
            _id:req.params.id,
            title: req.body.title,
            details: req.body.details,
            code: req.body.code,
            language:"C++",
            inputs:req.body.inputs,
            tags:req.body.tags, 
            output:data.error,
            type:true
          }}
        );}
    });
    }
    else if(Lan=='Py'){
      let envData = { OS : os }; 
      compiler.compilePythonWithInput( envData , req.body.code, req.body.inputs ,  function(data){
        if(!data.error)
          {res.render('FM/visit1', {fm:{
              _id:req.params.id,
              title: req.body.title,
              details: req.body.details,
              code: req.body.code,
              language:"Py",
              inputs:req.body.inputs,
              tags:req.body.tags, 
              output:data.output,
              type:false
            }}
          );}
      else
        {res.render('FM/visit1', {fm:{
          _id:req.params.id,
          title: req.body.title,
          details: req.body.details,
          code: req.body.code,
          language:"Py", 
          inputs:req.body.inputs,
          tags:req.body.tags, 
          output:data.error,
          type:true
        }}
      );}

    });
  }
    else if(Lan=='Jv'){
      let envData = { OS : os }; // (Support for Linux in Next version)
      compiler.compileJavaWithInput( envData , req.body.code , req.body.inputs ,  function(data){
        if(!data.error)
          {res.render('FM/visit1', {fm:{
            _id:req.params.id,
            title: req.body.title,
            details: req.body.details,
            code: req.body.code,
            language:"Jv",
            inputs:req.body.inputs,
            tags:req.body.tags, 
            output:data.output,
            type:false
          }}
        );}
    else
      {res.render('FM/visit1', {fm:{
        _id:req.params.id,
        title: req.body.title,
        details: req.body.details,
        code: req.body.code,
        language:"Jv", 
        inputs:req.body.inputs,
        tags:req.body.tags, 
        output:data.error,
        type:true
      }}
    );}
      });
    }
}
});

// process  form
router.put('/', ensureAuthenticated, (req,res) => {
  let errors = [];
  if (!req.body.title) {
    errors.push({
      text: 'Please add title'})
  }
    if (!req.body.details) {
      errors.push({
        text: 'Please add Readme'})
    }
for(let i=0;i<req.user.codes.length;i++){
  if(req.user.codes[i].title==req.body.title){
    errors.push({text: "There's already exist a code with this title, Enter Unique title"});
    break;
  }
}
  if (errors.length > 0) {
    res.render('FM/add', {fm:{
      errors: errors,
      title: req.body.title,
      details: req.body.details,
      code: req.body.code,
      tags:req.body.tags
    }});
  }
  else {
    var newUser={
      title:req.body.title,
      user:req.user.email,
      code:req.body.code,
      details:req.body.details,
      tags:req.body.tags
    }
    req.user.codes.push(newUser);
    req.user.save().then(fm=>{
       req.flash('success_msg', 'Successfully Added');
       res.redirect('/FM');  
    })
  }
});

router.get('/star',(req,res)=>{
  let {a,b}=req.query;
  Explore.findOne({_id:b}).then(data=>{
    if(data){
      let found=false;
      for(let i=0;i<data.whom.length;i++){
        if(data.whom[i]==a){
          data.whom.splice(i,1);
          data.rate--;
          found=true;
          break;
        }
      }
      if(!found){
        data.rate++;
        data.whom.push(a);
      }
      let rate=data.rate+"";
      data.save().then(d=>{
        // console.log("came")
        res.status(200).send(rate);
        // res.status(200).end(rate);
      })
    }
  else{
    res.status(500);
  }  
  });
})

// delete form
router.get('/delet1/:id', ensureAuthenticated, (req,res) => {
  Explore.findOne({_id:req.params.id}).then(data=>{
    if(data){
      if(data.user!=req.user.name)res.render('FM/NA');
      else{
        Explore.deleteOne({_id:req.params.id}).then(data=>{
          res.redirect('/FM/WORLD');
        });
        }
    }
  });
});


module.exports = router;
