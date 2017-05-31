/**
 * Code Formatter - Version 0.1
 * Soni D.
 */

var Formatter = (function (c) {
  var g = {
    blockName     : "pre.codeBlock", /* HTMLELement <pre> + class name */
    cssCodeFont   : "font-family:Monospace; font-size:14px;",
    cssCodeFrame  : "border-radius:6px; box-shadow:0 0 2px 2px rgba(10,10,10,.68); background-color:#2E3436; color:#fff;",
    cssCodeNumTAB : "float:left; border-spacing:0; border-collapse:collapse; margin:0 8px 0 0; color:#000; text-shadow:1px 1px rgba(100,100,100,.9);",
    cssCodeNumTD  : "padding:0 7px 0 4px; text-align:right; background-color:gray;",
    blocks        : []
  };
  return {
    init : function () {
      g.blocks = document.querySelectorAll(g.blockName) ? document.querySelectorAll(g.blockName) : [];
      if ( g.blocks.length > 0 ) { this.format(); }
    },
    format : function () {
      var re = null, n = g.blocks.length, tmp = null;
      var parentNode = g.blocks[0].parentNode;
      /* Iterates the code blocks */
      for ( var i = 0; i < n; ++i ) {
        var strCode = g.blocks[i].innerHTML.trim();
        if ( strCode == 0 ) continue;
        /* Counts number of lines in every code block */
        re = /\r?\n|\r/g; // Literale Notation: RegEx (unveraendert) wird schon waehrend der Auswertung kompiliert.
                            //   => Schnelle Ausfuehrung.
                            //   => Ende jeder Zeile: "\r" (Carriage-return) oder "\n" (New-line).
        var ll = strCode.split(re).length;
        /* Iterates the lines within a code block */
        if ( ll > 0 ) {
          var TAB = document.createElement("table");
          for ( var j = 1; j <= ll; ++j ) {
            var TR = document.createElement("tr");
            var TD = document.createElement("td");
            TD.appendChild(document.createTextNode(j));
            tmp = g.cssCodeNumTD;
            if ( j === 1 )  tmp += "border-top-left-radius:6px;";
            if ( j === ll )  tmp += "border-bottom-left-radius:6px;";
            TD.setAttribute("style", tmp);
            TR.appendChild(TD);
            TAB.appendChild(TR);
          } // END-for
          // TAB.setAttribute("class", "cssClass1 cssClass2");
          TAB.setAttribute("style", g.cssCodeNumTAB + g.cssCodeFont);
          parentNode.insertBefore(TAB, g.blocks[i]);
          // Regular expression for code comments. Support: /*..*/ and //
          // Escape star * with double-backslash, i.e. * is like \\*
          re = "//[ ]*.*[\r\n]" // Comments in kind of //..
              + "|/\\*[ ]*.*[ ]*\\*/" // Comments in kind of /*..*/
              + "|/(\\*)([ ]*\\*[ ]*.*[\r\n])+"; // Many-Lines Comments
          re = new RegExp(re, "gi"); // RegExp object notation ==> langsamer als literal notation
          /* https://developer.mozilla.org/de/docs/Web/JavaScript/Guide/Regular_Expressions */
          /* https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/RegExp */
          /* https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/String/replace */
          g.blocks[i].innerHTML = strCode.replace(re, function (match, p, offset, string) {
            return "<span style='color:#40ff00;'>" + match + "</span>";
          });
        }
        g.blocks[i].setAttribute("style", g.cssCodeFrame + g.cssCodeFont);
      } // END-for
    }
  };
})();

// document.addEventListener("DOMContentLoaded", () => Formatter.init(), false);
document.addEventListener("DOMContentLoaded", function () { Formatter.init(); }, false);
