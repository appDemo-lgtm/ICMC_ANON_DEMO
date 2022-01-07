let sentiment,prediction,saScore,sntMnt, indNum, cover,audio,corpus,index9,index15,index18,index22,index24,index27,index32,index46,index47,index51,toggleBtn,txtNotes;
let bassMap_Red =0;
let midMap_Green =0;
let highMidMap_Blue =0;

let sph_rad;
let x,y;
let push_count =0;

let t = 10; //drunk walk parameters
let T = 10000;

function preload() {
    audio = loadSound("audio/Index 9.mp3");
    index9 = loadSound("audio/Index 9.mp3");
    index15 = loadSound("audio/Index 15.mp3");
    index18 = loadSound("audio/Index 18.mp3");
    index22 = loadSound("audio/Index 22.mp3");
    index24 = loadSound("audio/Index 24.mp3");
    index27 = loadSound("audio/Index 27.mp3");
    index32 = loadSound("audio/Index 32.mp3");
    index46 = loadSound("audio/Index 46.mp3");
    index47 = loadSound("audio/Index 47.mp3");
    index51 = loadSound("audio/Index 51.mp3");

    plyArr = [index9,index15,index18,index22,index24,index27,index32,index46,index47,index51];
    txtArr =[" 9. A body's visible, the soul is not. We can easily see that a paralytic cannot move his good leg. We cannot see that a bad man cannot move his good soul: but we should take it as the effect of a paralysis of the soul. And we have to struggle against it and subdue it. Such is the foundation of ethics, my dear Nicomachos.","15. The body's an envelope: and so it serves to contain what it then has to develop. The development is interminable. The finite body con- tains the infinite, which is neither soul nor spirit, but in fact the develop- ment of the body.","18. The body's simply a soul. A soul, wrinkled, fat or dry, hairy or callous, rough, supple, cracking, gracious, flatulent, iridescent, pearly, daubed with paint, wrapped in muslin or camouflaged in khaki, multicol- ored, covered with grease, wounds, warts. The soul is an accordion, a trumpet, the belly of a viola.","22. Different, bodies are all somewhat deformed. A perfectly formed body is a disturbing, indiscreet body in the world of bodies, unacceptable. It's a diagram, not a body.","24. A headless body's closed in on itself. It ties its muscles together, hooks its organs up to one another. The head's simple, a combination of alveoli and liquids in a triple envelope.","27. Bodies cross paths, rub up and press against each other, embrace or collide with one another: they send each other all these signals, so many signals, addresses, notices, which no defined sense can exhaust. Bodies produce a sense beyond sense. They're an extravagance of sense. Which is why a body seems to assume its sense only once it's dead, fixed. And maybe why we interpret the body as the soul's tomb. In reality, a body never stops stirring. Death freezes the movement of letting go and declin- ing to stir. A body is the stirring of the soul.","32. Eating isn't incorporating, but opening the body to the thing we devour, exhaling our insides in the tasting of fish or fig. Running unfolds those same insides with strides, fresh air on the skin, spent breath. Think- ing swings tendons, and various springs, back and forth with jets ofsteam and forced steps over great salt lakes with no discernable horizon. There's never any incorporation, but always exits, twists, openings-out, channel- ings or disgorgings, crossings, balancings. Intussusception is a metaphysi- cal chimera.","46. Why indices? Because there's no totality to the body, no synthetic unity. There are pieces, zones, fragments. There's one bit after another, a stomach, an eyelash, a thumb-nail, a shoulder, a breast, a nose, an upper intestine, a choledoch, a pancreas: anatomy is endless, until eventually running into an exhaustive enumeration of cells. But this doesn't yield a totality. On the contrary, we must immediately run through the whole nomenclatute allover again, so as to find, if possible, a trace of the soul imprinted on every piece. But the pieces, the cells, change as the calcula- tion enumerates in vain.","47. The body's exteriority and alterity include the unbearable: dejec- tion, filth, the ignoble waste that is still part of it, still belongs to its sub- stance and especially its activity, since it has to expel it, which is not one of its lesser functions. From excrement to the outgrowth of nails, hairs, or every kind of wart or purulent malignity, it has to put outside, and sepa- rate from itself, the residue or excess of its assimilatory processes, the ex- cess of its own life. The body doesn't want to say, see, or smell this. It feels shame about it, and all kinds of daily distress and embarrassment. The soul enjoins itself to silence concerning a whole part of the body whose own form it is.","51. Beauty spot: this is the name for those brown or black particles, slightly prominent, that sometimes (and, for some, often) make a point, a mark, or a mole on the skin. Rather than spot the skin, they accentuate its whiteness, or at least this is what was often said in days when snow and milk served as points of comparison par excellence for women's skin. Women would then, if need be, put velvet ''flies'' on their cheeks and neck. Today, we prefer darker skin, sunbathed or tanned. But the beauty spot keeps its appeal: it signals skin, sets off its expanse, and configures it, guides the eye and affects it as a mark of desire. We'd almost be inclined to call a beauty spot the seed of desire, a minuscule rise in intensity, a corpuscle whose dark tint concentrates the energy of the entire body, as does the nipple of the breast."];
}


function setup() {

    createCanvas(windowWidth*.75, windowHeight*.75, WEBGL);

    noStroke();
    background(0);

    fft = new p5.FFT();
    fft.setInput(audio);


    txtNotes = createDiv('<p>The Body in the Machine: A retranslation of soundworks for 58+1/63 Indices On The Body w/AMAE/DePinto, Jean-Luc Nancy & composition by ANONYMOUS, mediated via Web & AI/ML technologies. </p>');
    txtNotes.addClass("txt-note");

    // initialize sentiment analysis
    sentiment = ml5.sentiment('movieReviews', modelReady);
    //set up button and listeners
    toggleBtn = createButton("Play Index");
    toggleBtn.addClass("toggle-btn");

    toggleBtn.mousePressed(toggleAudio);
    toggleBtn.mousePressed(textHandler);
    toggleBtn.mousePressed(getSentiment);
    toggleBtn.mousePressed(push_inc);

}

function draw() {
  if (push_count >= 1){
    sphere_map();
  }
}

function sphere_map() {
  fft.setInput(audio);
  let waveform = fft.waveform(); // amplitudes along time domain
  let spectrum = fft.analyze();
  let bass, lowMid, mid, highMid, treble;

  bass = fft.getEnergy("bass"); // each an 8bit integer 0-255
  mid = fft.getEnergy("mid");
  highMid = fft.getEnergy("highMid");

  if(saScore > .4){ // sentiment is scored from 0-1 with .5 being neutral.
    rotateY(millis() /  1000);
    //Unique color coding for each case.
    bassMap_Red = 0;
    midMap_Green  = (90*saScore) + ((mid/250)*160);
    highMidMap_Blue = (90*saScore) +((highMid/250)*160);

  } else{
    rotateY(millis() / -1000);
    //Unique color coding for each case.
    bassMap_Red = (90*saScore) +((bass/250)*160);
    midMap_Green  = 0;
    highMidMap_Blue = (90*saScore)+((highMid/250)*160);

  }

//Drunk walk Generator to control light directionality
    x = noise(t);
    x = map(x,0,1,0,width);
    y = noise(T);
    y = map(y,0,1,0,height);
    t =t+0.01;
    T =T+0.01;
//Sphere
  sph_rad = width*.45;
  pointLight(bassMap_Red,midMap_Green, highMidMap_Blue, x, y, (sph_rad*-1)-10);
  sphere(sph_rad);
}

function toggleAudio() {
    if (audio.isPlaying()) {
      audio.stop();
      rndIndx = Math.floor((Math.random() * plyArr.length));
      audio = plyArr[rndIndx];
      indNum = rndIndx;
      audio.play();
    } else {
      audio.stop();
      rndIndx = Math.floor((Math.random() * plyArr.length));
      audio = plyArr[rndIndx];
      indNum = rndIndx;
      audio.play();
    }
      return audio, indNum;
}

function textHandler() {
  txtNotes.remove();
  txtNotes = createDiv('<p>'+txtArr[indNum]+'<div class = "att"></br>-Jean-Luc Nancy, <i>Corpus, 1992:(Trans. R.A. Rand)</i></div>'+'</p>');
  txtNotes.addClass("txt-note");

  return txtArr
}

function getSentiment() {
  // make the prediction
//  var prediction = sentiment.predict(txtNotes);
  const prediction = sentiment.predict(txtArr[indNum]);  // return the prediction

  saScore = prediction.score;
  console.log(saScore);
  return saScore;
}

function modelReady() {
  // model is ready
  console.log("Model Loaded!");
}

function push_inc(){
  push_count++;
}
