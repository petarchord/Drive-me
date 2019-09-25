const express= require('express');
const exphbs=require('express-handlebars');
const bodyParser=require('body-parser');
const mongo=require('mongodb').MongoClient;
const objectId=require('mongodb').ObjectID;
const methodOverride=require('method-override');
const path=require('path');
const moment=require('moment');
'use strict';
const sessionstorage=require('sessionstorage');







var url="mongodb://localhost:27017/project3";
var dates=[];
var auth;

const port=3000;
const app=express();

app.engine('handlebars',exphbs({defaultLayout:'main'}));
app.set('view engine','handlebars');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use(methodOverride('_method'));


let router = require("./src/router");
router.forEach(route => {
  app.use(route.path, route.handler);
});


/*var date=new Date(Date.now()).toLocaleDateString();
console.log(date); */



app.get('/',(req,res,next)=>{
    
    var m;
    for(var i=0;i<20;i++)
    {
       // m=moment().add(i,'days').format('dddd MMM Do YY');
        m=moment().add(i,'days').format('L');
        dates.push(m);
    }
    res.render('searchdrive',{
        dates:dates,
        snap:false
    });
});


app.get('/myprofile',(req,res,next)=>{
    var resultArray=[];
    if(auth==null || auth ==undefined)
    {
        res.render('login',{
            clicked:'myprofile'
        });
    }
    else
    {
        mongo.connect('mongodb://localhost:27017',{useNewUrlParser:true},(err,client)=>{
            if(err)
            {
                throw err;
            }
            var db=client.db('project3');
            db.collection('user').find({auth:auth},(err,result)=>{
                if(err)
                {
                    throw err;
                }
                console.log('My profile result :'+result[0]);
                result.forEach((doc,err)=>{
                    if(err)
                    {
                        throw err;
                    }
                    resultArray.push(doc);

                },()=>{

                    if(resultArray.length==0)
                    {
                        res.render('login');
                    }
                    else
                    {
                        res.render('myprofile',{
                            name:resultArray[0].name,
                            lname:resultArray[0].lname,
                            email:resultArray[0].email,
                            username:resultArray[0].username,
                        });
                    }
                    client.close();
                });
            });
        });

    }
});


app.get('/register',(req,res,next)=>{
    res.render('register');
});




app.get('/mydrives',(req,res,next)=>{
    var resultArray=[];
    var resultArrayDrives=[];
    if(auth==null || auth ==undefined)
    {
        res.render('login',{
            clicked:'mydrives'
        });
    }
    else
    {
            mongo.connect('mongodb://localhost:27017',{useNewUrlParser:true},(err,client)=>{
            if(err)
            {
                throw err;
            }
            var db=client.db('project3');
            db.collection('user').find({auth:auth},(err,result)=>{
                if(err)
                {
                    throw err;
                }
                console.log('My profile result :'+result[0]);
                result.forEach((doc,err)=>{
                    if(err)
                    {
                        throw err;
                    }
                    resultArray.push(doc);

                },()=>{

                    if(resultArray.length==0)
                    {
                        res.render('login');
                    }
                    else
                    {
                        sessionstorage.setItem('username',resultArray[0].username);
                        var username=resultArray[0].username;
                        db.collection('drives').find({user:username},(err,result)=>{
                            if(err)
                            {
                                throw err;
                            }
                            result.forEach((doc,err)=>{
                                if(err)
                                {
                                    throw err;
                                }
                                resultArrayDrives.push(doc);
                            },()=>{
                                if(resultArrayDrives.length==0)
                                {
                                    res.render('mydrives',{
                                        empty:true,
                                        
                                    });
                                }
                                else
                                {
                                    res.render('mydrives',{
                                        empty:false,
                                        result:resultArrayDrives
                                    });
                                }
                            });
                        });
                    }
                    client.close();
                });
            });
        });


    }
});

app.get('/adddrive',(req,res,next)=>{
    if(auth==null || auth==undefined)
    {
        res.render('login',{
            clicked:'adddrive'
        });
    }
    else
    {
         res.render('adddrive',{
         dates:dates
        });

    }
   
});

app.get('/editdrive/:id',(req,res,next)=>{
    var resultArray=[];
    var id=req.params.id;
    mongo.connect('mongodb://localhost:27017',{useNewUrlParser:true},(err,client)=>{
        if(err)
        {
            throw err;
        }
        var db=client.db('project3');
        db.collection('drives').find({"_id":objectId(id)},(err,result)=>{
            if(err)
            {
                throw err;
            }
            result.forEach((doc,err)=>{
                if(err)
                {
                    throw err;
                }
                resultArray.push(doc);
            },()=>{
                client.close();
                res.render('editdrive',{
                result:resultArray[0],
                dates:dates
            });


                  });
            
        });
    });
});


app.get('/deletedrive/:id',(req,res,next)=>{
    var id=req.params.id;
    mongo.connect('mongodb://localhost:27017',{useNewUrlParser:true},(err,client)=>{
        if(err)
        {
            throw err;
        }
        var db=client.db('project3');
        db.collection('drives').deleteOne({"_id":objectId(id)},(err,result)=>{
            if(err)
            {
                throw err;
            }
            client.close();
            res.redirect('/mydrives');

        });
    });

});

app.get('/about',(req,res,next)=>{
    res.render('about');
});

app.get('/logout',(req,res,next)=>{

    if(auth != undefined && auth != null)
    {
        auth=null;
    }
    res.redirect('/');

});



app.post('/myprofile',(req,res,next)=>{
    var resultArray=[];

            if(req.body.register =='some')
    {
        //request comes from register form
        
        if(!req.body.uname || !req.body.passw || !req.body.passw2)
{
    res.render('register', {
        error: 'You have to enter all fields in order to create an account!'
    });
    return;
}

    if(req.body.passw != req.body.passw2)
{
        res.render('register', {
        error: 'You have to enter the same password in both fields!'
    });
    return;
        
}

    uname=req.body.uname;
    var passw=req.body.passw;
    var name=req.body.name;
    var lname=req.body.lname;
    var email=req.body.email;
    mongo.connect('mongodb://localhost:27017',{useNewUrlParser:true},(err,client)=>{
        if(err)
        {
            throw err;
        }
        var db=client.db('project3');
        db.collection('user').find({username:req.body.uname},(err,result)=>{
            if(err)
            {
                throw err;
            }
            console.log('result login register:'+result);
            result.forEach((doc,err)=>{
                if(err)
                {
                    throw err;
                }
                resultArray.push(doc);
            },()=>{
                if(resultArray.length > 0)
                {
                    res.render('register',{error:'This username is already in use,try another one!'});
                    client.close();
                    return;
                }
                else
                {
                    auth = new Buffer(req.body.uname + ':' + req.body.passw).toString('base64');
                    db.collection('user').insert({
                        username:req.body.uname,
                        password:req.body.passw,
                        name:req.body.name,
                        lname:req.body.lname,
                        email:req.body.email,
                        auth:auth
                    },(err,result)=>{
                        if(err)
                        {
                            throw err;
                        }
                    });
                    client.close();
                    res.render('myprofile',{
                        username:req.body.uname,
                        name:req.body.name,
                        lname:req.body.lname,
                        email:req.body.email
                    });
                }
            });

        });
    });

    /*
    client.hget('users',uname,(err,obj)=>{

        if(obj)
    {
            res.render('register', {
            error: 'The username is already in use, try another one!'
        });
        return;

    }
    
    else
    {
        client.INCR('next_user_id', (err,objid) => {
           var auth = new Buffer(uname + ':' + passw).toString('base64'); 
           console.log(auth);
           if(!client.hset('users',uname,objid))
           console.log('Failure during the db write in users');
           if(!client.hset('user:'+objid,'username',uname) || 
           !client.hset('user:'+objid,'password',passw) || !client.hset('user:'+objid,'auth',auth))
           console.log('Failure during the db write in user');
           res.render('home',{
               username:uname
           });
           return;
           

        });
    }

    }); */
   


}
//request comes from login form
else
{
    var resultArrayLogin=[];
    if(!req.body.username || !req.body.password)
    {
    res.render('login', {
        error: 'You have to enter both , the username and password!'
    });
    return;
    }
    uname=req.body.username;
    var password=req.body.password;
    mongo.connect('mongodb://localhost:27017',{useNewUrlParser:true},(err,client)=>{
        if(err)
        {
            throw err;
        }
        var db=client.db('project3');
        db.collection('user').find({username:req.body.username},(err,result)=>{
            if(err)
            {
                throw err;
            }
            result.forEach((doc,err)=>{
                if(err)
                {
                    throw err;
                }
                resultArrayLogin.push(doc);

            },()=>{
                if(resultArrayLogin.length==0)
                {
                    client.close();
                    res.render('login',{error:'Wrong username or password!'}); 
                    return;
                }
                else
                {
                    if(resultArrayLogin[0].password != req.body.password)
                    {
                        client.close();
                        res.render('login',{error:'Wrong username or password!'});
                        return;
                    }
                    else
                    {
                        auth=resultArrayLogin[0].auth;
                        client.close();
                        if(req.body.clicked =='myprofile')
                        {
                            res.render('myprofile',{
                            username:resultArrayLogin[0].username,
                            name:resultArrayLogin[0].name,
                            lname:resultArrayLogin[0].lname,
                            email:resultArrayLogin[0].email

                        });

                    }
                    else if(req.body.clicked == 'mydrives')
                    {
                        res.redirect('/mydrives');

                    }
                    else
                    {
                        res.redirect('/adddrive');
                    }
                    
                        
                    }
                }
            });
        });
    });

    /*
    client.hget('users',username,(err,obj1)=>{

        
        if(!obj1)
        {
            res.render('welcome', {
                error: 'Wrong username or password!'
            });
        }
        else
        {
            client.hget('user:'+obj1,'password',(err,obj2)=>{
                if(obj2 != password)
                {
                    res.render('welcome', {
                        error:'Wrong username or password!'
                    });
                }
                else
                {
                        
                     var cookies=new Cookies(req,res);
                     client.hget('user:'+obj1,'auth',(err,objauth)=>{
                         cookies.set('auth',objauth);
                         
                     });
                     temp=username;
                     res.render('home',{
                     username:username
            });
                     console.log('The content of the cookie:'+cookies.get('auth'));
                }
            })
        }
    }) */
           
}

});

app.post('/searchresult',(req,res,next)=>{

    //db interaction code
    var resultArray=[];
    mongo.connect('mongodb://localhost:27017',{useNewUrlParser:true},(err,client)=>{
        if(err)
        {
            res.send({msg:err});
        }
        var db=client.db('project3');
        db.collection('drives').find({$and:[{start:req.body.start},{end:req.body.end},{date:req.body.date}]},(err,result)=>{
            if(err)
            {
                console.log('error occured!');
                res.send({msg:err});
            }
            result.forEach((doc,err)=>{
                if(err)
                {
                    res.send({msg:err});
                }
                resultArray.push(doc);
            },()=>{
                console.log('resultArray:'+resultArray.length)
                if(resultArray.length==0)
                {
                    res.render('searchdrive',{snap:true ,dates:dates});
                }
                else
                {
                    res.render('searchresult',{result:resultArray,date:resultArray[0].date
                });
                }
                
                client.close();

                });
            
        });
        
    });
    /*
    mongo.connect(url,{useNewUrlParser:true},(err,db)=>{
        if(err)
        {
            res.send({msg:err});
        }
     //   var myDate=moment(req.body.date).format('L');
  */
                
    });


app.post('/mydrives',(req,res,next)=>{
    var resultArray=[];
    mongo.connect('mongodb://localhost:27017',{useNewUrlParser:true},(err,client)=>{
        if(err)
        {
            throw err;
        }
        var db=client.db('project3');
        var username=sessionstorage.getItem('username');
        console.log('username in mydrives:'+username);
        db.collection('drives').insert({
            start:req.body.start,
            end:req.body.end,
            date:req.body.date,
            time:req.body.time,
            car:req.body.car,
            price:req.body.price,
            phone:req.body.phone,
            persons:req.body.persons,
            descr:req.body.descr,
            user:username
        },(err,result)=>{
            if(err)
            {
                throw err;
            }
        });
        client.close();
        res.redirect('/mydrives');
    });

});

app.post('/editdrive',(req,res,next)=>{
    var id=req.body.id;
    console.log('id:'+id);
    var username=sessionstorage.getItem('username');
    var item={
        start:req.body.start,
        end:req.body.end,
        date:req.body.date,
        time:req.body.time,
        car:req.body.car,
        price:req.body.price,
        phone:req.body.phone,
        descr:req.body.descr,
        persons:req.body.persons,
        user:username
    };
    mongo.connect('mongodb://localhost:27017',{useNewUrlParser:true},(err,client)=>{
        if(err)
        {
            throw err;
        }
        var db=client.db('project3');
        db.collection('drives').updateOne({"_id":objectId(id)},{$set: item},(err,result)=>{
            if(err)
            {
                throw err;
            }
            client.close();
            res.redirect('/mydrives');

        });
    });
});




app.get('/searchresult/:id',(req,res,next)=>{
    var id=req.params.id;
    var resultArray=[];
    mongo.connect('mongodb://localhost:27017',{useNewUrlParser:true},(err,client)=>{
        if(err)
        {
            res.send({msg:err});
        }
        var db=client.db('project3');
        db.collection('drives').find({"_id":objectId(id)},(err,result)=>{
            if(err)
            {
                throw err;
            }
             result.forEach((doc,err)=>{
                if(err)
                {
                   throw err;
                }
                resultArray.push(doc);
            },()=>{
                res.render('driveinfo',{
                    start:resultArray[0].start,
                    end:resultArray[0].end,
                    date:resultArray[0].date,
                    time:resultArray[0].time,
                    car:resultArray[0].car,
                    price:resultArray[0].price,
                    phone:resultArray[0].phone,
                    descr:resultArray[0].descr,
                    persons:resultArray[0].persons

                });
                client.close();

                });
            
            

        });
    });

});



    

app.listen(port,() => {
    console.log(`Listening on port ${port} ...`);
});