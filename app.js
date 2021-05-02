const express = require('express')
const passport = require('passport')
const bodyParser = require('body-parser')
const { check, validationResult } = require('express-validator')

const app = express()
const port = 5000
let data = {}// variabile globale per dati inseriti nel form

app.set('view engine', 'ejs') // Set Templating Enginge

const urlencodedParser = bodyParser.urlencoded({ extended: false })


app.get('/', (req, res)=> {
    res.render('register')
})

app.get('/login', (req, res)=> {
    res.render('login')
})

app.get('/logout',(req,res)=>{
    req.logOut();
    res.redirect('/')
})

app.post('/', urlencodedParser, [
    check('name', 'Nome obbligatorio')
    .isLength({ min: 3}),
    check('surname', 'Cognome obbligatorio')
    .isLength({ min: 3}),
    check('email', 'Email non valida')
    .isEmail(),
    check('phone', 'Numero non corretto')
    .exists()
    .isNumeric(),
    check('password')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i")
    .withMessage('La password deve essere almeno di 8 caratteri e contenere un numero, una maiuscola, una minuscola e un carattere speciale ')
    .custom((value,{req, loc, path}) => {      
            if (value === '' || value !== req.body.confirm_password) {
                // trow error if passwords do not match
                throw new Error("Le password non coincidono");
            } else {
                return value;
            }
    })     
    ], (req, res)=> {
        data = req.body// inserisco in data i dati del form 
        const errors = validationResult(req)// gestione errori del form
        if(!errors.isEmpty()){
            const alert = errors.array()
            res.render('register',{
                alert
            })
        }
        console.log(data);
    res.redirect('/login');    
})

app.post('/login', urlencodedParser,(req, res)=>{
    if(req.body.email !== data.email || req.body.password !== data.password){      
        res.send(`
        <h3>I dati non coincidono</h3>
        `)
    } else{
        res.send(`
        <h1>Sessione Privata</h1> 
        <a href="/logout">LogOut</a>
        `)
    }
})


app.listen(port, () => console.info(`App listening on port: ${port}`))