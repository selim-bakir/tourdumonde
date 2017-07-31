  $.getScript("./scripts/infos.js", function() {

    console.log(pays);

    //Ajout des variables d'elements
    var jQmenu = $('#menu ul'),
      jQmain = $('#main-content'),
      jQkvImg = $('#main-content .kv img'),
      jQgallery = $('#main-content .gallery');

    //Ajout de la liste des pays
    $.each(pays[0]['nom'], function(i) {
      jQmenu.append('<li>' + pays[0]['nom'][i] + '</li>');
    });

    //Action au click sur chacun des pays     
    var jQmenuList = $('#menu ul li');

    jQmenuList.click(function() {
      //Ajout le src du kv correspondant au pays choisi
      jQkvImg.attr('src', pays[0]['img'][0][$(this).index()]);
    })

  });

