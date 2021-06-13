const express = require('express');
const router = express.Router();
const fs = require('fs')
const imageData = require('../model/image.model.js');

let imageValues;
/* GET home page. */

router.get('/', function(req, res, next) {

  //gestion de l'image singulière 
  let random = randomNumber(0, imageData.length-1)
  let imageSinguliere = imageData[random]
  let imageKeys = Object.keys(imageSinguliere)
  imageValues = Object.values(imageSinguliere)

  console.log('image singuliere', imageSinguliere)
  console.log('imageKeys : ', imageKeys)

  //gestion des images neutres 

  //generation des random id et construction des urls pour les images neutres
  let urlNeutre = []
  for (i=0; i<7 ; i++){
    let randomNeutre = randomNumber(1,13)

    urlNeutre.push('/images/neutres/'+String(randomNeutre)+'.jpg')
  }
  console.log("url neutre", urlNeutre);


  let url=urlNeutre
  url.push(imageValues[1])

  url = shuffleArray(url)
  
  res.render('index', { title: 'Captcha',  image:url, indice:imageValues[0]});
});

/* Check user answer to CapChat. */
router.post('/verify', function(req, res, next) {
  console.log(req.body)
  if (req.body.image_selected==imageValues[1]){
    console.log('bravo')
    res.sendStatus(200)
  }
  else{
    res.sendStatus(418)
  }
});


module.exports = router;


/**
 * generate a random number
 * @param {*} min 
 * @param {*} max 
 * @returns 
 */
function randomNumber(min, max){
  return Math.floor(Math.random() * (max-min) + min)
}

/**
 * melange les éléments d'un tableau de manière aléatoire
 * @param {*} array 
 */
function shuffleArray(array){
  let shuffledArray = array;
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffledArray[i];
    shuffledArray[i] = shuffledArray[j];
    shuffledArray[j] = temp;
  }
  return shuffledArray;
}