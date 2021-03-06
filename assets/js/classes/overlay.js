Class.subclass('Overlay', {
  
  init: function() {
    this.bgNode = $('#overlay');
    this.contentNode = $('#overlay-contents'); 
  },
  
  display: function(html, stack) {
    this.contentNode.html(html);
    this.show();
  },
  
  show: function() {
    this.bgNode.show();
    this.contentNode.show();
  },
  
  hide: function() {
    this.contentNode.hide();
    this.bgNode.hide();
  },
  
  displayPage: function(name) {
    var builder = new OverlayBuilder();
    Overlay.PAGES[name].call(this, builder);
    var html = builder.render();
    this.display(html);
  }
  
});

Class.subclass('OverlayBuilder', {
  
  init: function() {
    this.buffer = '';
  },
  
  render: function() {
    return this.buffer;
  },
  
  h1: function(txt) {
    return this.html("<h1>" + txt + "</h1>\n");
  },
  
  p: function(txt) {
    return this.html("<p>" + txt + "</p>\n");
  },
  
  indent: function(txt) {
    return this.html('<p style="margin-left:20px;">' + txt + '</p>');
  },

  text: function(name, value) {
    var html = '<input type="text" id="'+name+'" name="'+name+'"';
    if (value) { html += ' value="' + value + '"'; }
    html += '></input>';
    return this.html(html);
  },
  
  button: function(name, onclick, icon) {
    return this.html('<button onclick="'+onclick+'">'+name+'</button>');
  },
  
  html: function(txt) {
    this.buffer += txt;
    return this; 
  }
  
});

Overlay.PAGES = {
  'welcome': function(p) {
    p.h1('Welcome!')
      .p('In this game, you command a robot tank that must destroy the enemy base.')
      .p('To do this, you must write a program to move and shoot your way through each level.')
      .p('You may use the following commands, one per line:')
      .indent('<b>move, left, right, fire, wait</b>')
      .p('Once you have written your program, click the "Run Program" button to see if it works!')
      .button('Start', "app.loadLevel('intro', 0)");
  },
  
  'select-level': function(p) {
    var diffs = Level.difficulties();
    var levels = '<table class="indent">';
    var completedLast = false;

    for (var d = 0; d < diffs.length; d++) {
      var diff = diffs[d];
      var count = Level.levelCount(diff);
      levels += '<tr>';
      levels += '<td style="vertical-align: middle;width: 100px;">' + diff.toUpperCase() + '</td>';
      levels += '<td>';
      for (var num = 0; num < count; num++) {
          console.log("diff: " + diff + " level: " + num);
        var klass = 'level';
        
        if (Level.isCompleted(Level.key(diff, num))) {
            completedLast = true;
            klass += ' completed';
            levels += '<div class="' + klass + '" onclick="app.loadLevel(\'' + diff + '\', ' + num + ')">' + (num + 1) + '</div>';
        } else if (completedLast || (d === 0 && num === 0)) {
            levels += '<div class="' + klass + '" onclick="app.loadLevel(\'' + diff + '\', ' + num + ')">' + (num + 1) + '</div>';
            completedLast = false;
        }
      }
      levels += '</td>';
      levels += '</tr>'; 
    }
    levels += '</table>';
    
    p.h1('Select a Level')
      .p('Click on a level number to begin.')
      .html(levels)
      .p('<i>Higher numbers are harder</i>');
  },
  
  'win': function(p) {
    p.h1('You Win!!!')
      .p('Congratulations!  See if you can beat the next level!')
      .button('Next Level', "app.overlay.displayPage('select-level');");
  },
  
  'lose': function(p) {
    p.h1('Try Again')
      .p('You did not destroy the base - keep working on your program and try again!')
      .button('Retry', 'app.resetLevel()')
      .button('Select Level', "app.overlay.displayPage('select-level');");
  },
  
  'help-programming': function(p) {
    p.h1('Programming Help')
      .p('To program your tank, you must enter a series of commands, one per line, in the "Program" box on the right of the screen.')
      .p('You may choose from the following commands:')
      .indent('<b>move</b>: moves the tank forward one square')
      .indent('<b>right</b>: turn right 90 degrees')
      .indent('<b>left</b>: turn left 90 degrees')
      .indent('<b>wait</b>: wait a turn')
      .indent('<b>fire</b>: fire your gun - the bullet will travel until it hits something')
      .p('Commands can be repeated multiple times by adding a count like so: <b>move(3)</b>')
      .button('Close', "app.overlay.hide();");
  }
}