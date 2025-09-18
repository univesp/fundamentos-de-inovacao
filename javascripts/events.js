$(document).ready(function(){

  //////////////////////////////////////////////////////////////////
  // HEADER DINÂMICO
  // Mostra header somente no início da página.
  // Descomentar caso utilizada a classe .header-dinamico. Caso contrário, deletar.

    $(window).scroll(function(){
      var nav = $(".header-dinamico .container");
      var scroll = $(window).scrollTop();
      if(scroll == 0){
        nav.fadeIn();
      } else {
        nav.fadeOut();
      }
    });
$(".sticker").sticky({topSpacing:0});

  // Detecta clique na carta para virá-la
  $(".card-container").click(function(){
    gira_carta();
  });

  //Detecta clique no botão para avançar a carta
  $("#btnContinuar").click(function(){
    proximo();
    botao_continuar = false;
  });

  // Detecta a tecla para virar ou avançar a carta
  botao_continuar = false;
  $(document).keydown(function(e) {
    if(e.keyCode == 32) {
      gira_carta();
    };
    if(e.keyCode == 13) {
      if(botao_continuar == true) {
        proximo();
      }
    }
  });

  $(".myButton").click(function() {
      $('.intro, .titulo').fadeOut();
        $('#conteudo2').fadeIn(2000);
        $("html, body").animate({
          scrollTop: $('nav').offset().top
        }, 500);

    });

  // Ações para girar cartas
  function gira_carta (){
    //Troca a mensagem
    $("#msgVirar").hide();
    $("#btnContinuar").fadeIn();
    //Rotaciona carta
    if($(".card-container").hasClass('hover')) {
      $(".card-container").removeClass('hover');
    } else {
      $(".card-container").addClass('hover');
    }
    // Define o parâmetro que permite avanço de carta por Enter
    botao_continuar = true;
  };

  var cartaAtual = 1;


  // Função para avançar os cards
  function proximo() {
    // Troca a mensagem e desativa avanço de carta por Enter
    $("#msgVirar").delay(1200).fadeIn();
    $("#btnContinuar").fadeOut();
    botao_continuar = false;
    // Dispensa a carta atual
    $("#card" + cartaAtual).animateCss('bounceOutLeft', function() {
      $("#card" + cartaAtual).hide();
      $(".card-container").removeClass('hover');
      // Chama a próxima carta ou inicia o questionário e foca a primeira questão
      if(cartaAtual<5){
        var cartaProxima = cartaAtual + 1;
        $("#card" + cartaProxima).show();
        $("#card" + cartaProxima).animateCss('bounceInRight');
        cartaAtual++;
      } else {
        $('.intro').hide();
        $('.titulo').hide();
        $('.instrucao').hide();
        $('.questionarios').fadeIn();
        $("html, body").delay(400).animate({
          scrollTop: $('nav').offset().top
        }, 1000);
      }

    });
  };


  //Função de extensão do Jquery para criar a função animateCss e conseguir encadear funções apos as animações
  $.fn.extend({
    animateCss: function(animationName, callback) {
      var animationEnd = (function(el) {
        var animations = {
          animation: 'animationend',
          OAnimation: 'oAnimationEnd',
          MozAnimation: 'mozAnimationEnd',
          WebkitAnimation: 'webkitAnimationEnd',
        };
        for (var t in animations) {
          if (el.style[t] !== undefined) {
            return animations[t];
          }
        }
      })(document.createElement('div'));

      this.addClass('animated ' + animationName).one(animationEnd, function() {
        $(this).removeClass('animated ' + animationName);

        if (typeof callback === 'function') callback();
      });
      return this;
    },
  });


  var perguntaAtual = 1; //define a questão atual
  var bingo = 0; //contador de respostas certas na primeira tentativa
  var errou = 0; //contador de respostas erradas a cada pergunta

  // Atribui cada tecla a uma resposta
    $(document).keydown(function(r) {
      questaoAtual = "#questionario"+perguntaAtual
      console.log(questaoAtual);
      if(r.keyCode == 97||r.keyCode == 49){
        console.log("1");
        $(questaoAtual+" .resposta1").click();
      };
      if(r.keyCode == 98||r.keyCode == 50){
        console.log("2");
        $(questaoAtual+" .resposta2").click();
      };
      if(r.keyCode == 99||r.keyCode == 51){
        console.log("3");
        $(questaoAtual+" .resposta3").click();
      };
      if(r.keyCode == 100||r.keyCode == 52){
        console.log("4");
        $(questaoAtual+" .resposta4").click();
      };
    });

  // Dá feedback de acordo com o número de acertos
  // Define cada feedback
  function retornaFeedback(bingo){
    var resultadoExcelente = '<p>Você conseguiu acertar <b>' + bingo + '</b> dos <b>5</b> conceitos apresentados. <b>Muito bem!</b></p><p class="d-lg-none">Se quiser, você pode conferir os conceitos novamente na tabela abaixo.</p><p class="d-none d-lg-block">Se quiser, você pode imprimir a tabela abaixo com todos os conceitos apresentados clicando no link.</p>';
    var resultadoBom = '<p>Você conseguiu acertar <b>' + bingo + '</b> dos <b>5</b> conceitos apresentados.</p><p>Faltou pouco... Que tal consultar a tabela abaixo para não ter mais dúvidas?</p><p class="d-none d-lg-block">Se quiser, você pode imprimir clicando no botão imprimir.</p>';
    var resultadoRuim = '<p>Você conseguiu acertar <b>' + bingo + '</b> dos <b>5</b> conceitos apresentados.</p><p>Você pode melhorar e a tabela abaixo pode ajudá-lo! Que tal consultá-la?</p><p class="d-none d-lg-block">Se quiser, você pode imprimir clicando no botão imprimir.</p>';
    // define parâmetros para aplicação dos feedbacks
    if(bingo < 2){
      $("#feedback").append(resultadoRuim);
    } else if (bingo>=2 && bingo<4) {
      $("#feedback").append(resultadoBom);
    } else {
      $("#feedback").append(resultadoExcelente);
    };
  }

  // Confere resposta da questão
  function corrigirQuestao(){
    proximaPergunta = perguntaAtual+1;
    console.log("corrigir questao")
    $(this).animateCss('pulsinho');
    // ações para respostas certas
    if ( $( this ).hasClass( "certo" ) ) {
      console.log("certo");
      $(this).addClass('disabled');
      // conta as respostas na mosca (sem erros anteriores)
      if (errou==0) {
        bingo++
      }
      $('#cardresposta'+perguntaAtual).animateCss('pulse');
      if ($(window).width() > 577) {
       $("html, body").delay(1000).animate({
          scrollTop: $('.titulo').offset().top
        }, 800);
     }
      // chama a conclusão após a última pergunta
      if (perguntaAtual==5) { //identificador da última pergunta
        $("html, body").delay(700).animate({
          scrollTop: $('.titulo').offset().top
        }, 1000);
        setTimeout(function(){
          $('.questionarios').animateCss('fadeOut', function(){
            $('.questionarios').hide();
            $('.conclusao').show();
            $('.conclusao').animateCss('fadeInDown');
          });

        }, 800);
        retornaFeedback(bingo);
      } else {
        // chama a próxima questão, quando não está na última pergunta
        // muda as ações de acordo com o tamanho de tela
        if ($(window).width() < 576) {
          $('#questionario'+proximaPergunta).delay(850).fadeIn(880);
          setTimeout(function(){
            $("html, body").animate({
              scrollTop: $('#questionario'+proximaPergunta).offset().top
            }, 1000);
          }, 900);
          $('#cardresposta'+proximaPergunta).sticky({topSpacing:0});
          $('#questionario'+perguntaAtual).delay(1000).fadeOut(1000)
          perguntaAtual++;
          console.log(perguntaAtual)
        }
        else {
          setTimeout(function(){
            $('#questionario'+perguntaAtual).animateCss('bounceOutLeft', function(){
              $('#questionario'+perguntaAtual).hide()
              $('#questionario'+proximaPergunta).show();
              $('#questionario'+proximaPergunta).animateCss('bounceInRight');
              console.log("pow");
              console.log("pergunta Atual = "+perguntaAtual);
              perguntaAtual++;
            });
          }, 800);
        };
      };

      errou=0;
    } else {
      // ações para respostas erradas
      console.log("errado");
      errou++; // registra o erro para não contabilizar a soma de acertos
      $(this).attr("disabled", "disabled");
      $('#cardresposta'+perguntaAtual).animateCss('shake');
    }
    console.log("bingo: " +bingo);
    console.log("errou: " +errou);
  };

// Aciona a correção da questão
  $(".respostas").click(corrigirQuestao); // Seu código abaixo

})
