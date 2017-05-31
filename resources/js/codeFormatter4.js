/**
 * Code Formatter - Version 0.4
 * Soni D.
 */

var Formatter = (function () {
  var keywords = { /* Keywords of Programming Languages */
     c          : "auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|int|long|register|return|short|signed|sizeof|static|struct|switch|typedef|union|unsigned|void|volatile|while",
     java       : "abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|default|do|double|else|enum|extends|final|finally|float|for|goto|if|iplements|import|instanceof|int|interface|long|native|new|package|private|protected|public|return|short|static|strictfp|super|switch|synchronized|this|throw|throws|transient|try|void|volatile|while",
     javascript : ""
  };
  var g = { /* Global variable */
    name          : "pre.codeBlock", /* HTMLElement <pre> and class [codeBlock] */
    blocks        : [], /* List of <pre> blocks */
    cssCodeFont   : "font-family:Monospace; font-size:14px;",
    cssCodeFrame  : "border-radius:6px; box-shadow:0 0 2px 2px rgba(10,10,10,.68); background-color:#2E3436; color:#fff;",
    cssCodeNumTAB : "float:left; border-spacing:0; border-collapse:collapse; margin:0 8px 0 0; color:#000; text-shadow:1px 1px rgba(100,100,100,.9);",
    cssCodeNumTD  : "padding:0 7px 0 4px; text-align:right; background-color:gray;",
    // RegExp for code comments. Support: /*..*/ and //
    // Escape star sign (*) with double-backslash, i.e. * is like \\*
    reComments    : "//[ ]*.*[ ]*[\r\n]"   // Comments in the kind of //...
                  + "|/\\*[ ]*.*[ ]*\\*/" // Comments in the kind of /* .. */
                  + "|/\\*([ ]*.*[ ]*[\r\n])+[ ]*\\*/", // Many lines comments /** .. */
    langs         : ["c","java","javascript"], /* Programming Languages */
    reLangs       : { /* RegExp for Programming Languages */
       c          : "(\\b(" + keywords.c    + ")\\b)(?=.*(;|(\r?\n|\r)?{|}))" + "|#include",
       java       : "(\\b(" + keywords.java + ")\\b)(?=.*(;|(\r?\n|\r)?{|}))",
       javascript : null
    },
    bgColors      : ["#FA5858","#DF7401","#2E64FE","#FA58F4","#4B8A08","#F78181","#6E6E6E"],
  };
  return {
    init : function () {
      g.blocks = document.querySelectorAll(g.name) ? document.querySelectorAll(g.name) : [];
      if ( g.blocks.length !== 0 ) {
        /* Add new function to String prototype to escape special signs */
        if ( typeof String.prototype.escapeHTML === 'undefined' ) {
          String.prototype.escapeHTML = function () { 
            return (
              this.replace(/<\/.*>(?![^ ])/g, "") // Negated Lookahead x(?:y): 
                                                  //    Match any pattern </.*> (e.g. </stdio.h>) only if it is NOT followed 
                                                  //    by [^ ] (i.e. any special sign like \r,\n,\t etc. that is NOT empty).
                                                  //    In anderen Worten, match jedes Muster, das vor \r,\n,\t etc. steht.
                  .replace(/>/g, "&gt;")   // '>' is replaced by &gt;
                  .replace(/</g, "&lt;")   // '<' is replaced by &lt;
            ); // https://developer.mozilla.org/de/docs/Web/JavaScript/Guide/Regular_Expressions
          };
        }
        this.format();
      }
    }, // init
    format : function () {
      var nn = g.blocks.length, ll = 0 /* Number of lines within a code block */, 
          re = null /* RegExp object */, strCode = tmp = null,
          TAB = TR = TD = null,
          parentNode = g.blocks[0].parentNode;
      /* Iterates the code blocks */
      for ( var i = 0; i < nn; ++i ) {
        strCode = g.blocks[i].innerHTML.escapeHTML().trim(); // Get content in code block.
        if ( strCode.length == 0 ) continue;
        re = /\r?\n|\r/g; // Literal Notation 
                          //   => Faster than RegExp-constructor: new RegExp(..)
                          //   => Line-feed / Carriage-return: \r\n (Win/DOS), \r (older Macs), \n (Linux/Unix)
        ll = strCode.split(re).length; // Number of lines within a code block.
        if ( ll < 1 )  continue;
        TAB = document.createElement("table");
        /* Iterates the lines within code block */
        for ( var j = 1; j <= ll; ++j ) {
          TR = document.createElement("tr");
          TD = document.createElement("td");
          tmp = g.cssCodeNumTD;
          if ( j === 1 )  tmp += "border-top-left-radius:6px;";
          if ( j === ll ) tmp += "border-bottom-left-radius:6px;";
          TD.appendChild(document.createTextNode(j));
          TD.setAttribute("style", tmp);
          TR.appendChild(TD);
          TAB.appendChild(TR);
        } // END-for (lines)
        parentNode.insertBefore(TAB, g.blocks[i]);
        TAB.setAttribute("style", g.cssCodeNumTAB + g.cssCodeFont);
        g.blocks[i].setAttribute("style", g.cssCodeFrame + g.cssCodeFont);
        /* https://developer.mozilla.org/de/docs/Web/JavaScript/Guide/Regular_Expressions */
        /* https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/RegExp */
        /* https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/String/replace */
        // RegExp for code comments. Support: /*..*/ and //
        re = new RegExp(g.reComments, "gi"); // RegExp object => slower than Literal notation
        strCode = strCode.replace(re, function (match, p, offset, string) {
          return "<span style='color:#40ff00;'>" + match + "</span>";
        });
        /* Highlights lines or keywords of specified programming language */
        strCode = this.highlight(strCode, g.blocks[i].getAttribute("class"));
        // Returns formatted code
        g.blocks[i].innerHTML = strCode;
      } // END-for (code blocks)
    }, // format
    /**
     *
     * @returns Formatted code with some lines and keywords highlighted
     */
    highlight : function (strCode /* string */, strAt /* string attributes */) {
      var arr = strAt.split(" ");
      var j, k, m, re = nums = lines = null;
      if ( arr.length < 2 ) return strCode;
      /* Highlight keywords */
      j = 0;
      outer_loop: while ( j < arr.length ) {
        k = 0;
        inner_loop: while ( arr[j] !== g.langs[k] && k < g.langs.length ) { k += 1; }
        if ( arr[j] === g.langs[k] ) { break outer_loop; }
        j += 1;
      }
      if ( j < arr.length && k < g.langs.length ) {
        re = new RegExp(g.reLangs[g.langs[k]], "g");
        strCode = strCode.replace(re, function (match, p, offset, string) {
          return "<span style='color:#FFFF00; font-weight:600; text-shadow:0 1px rgba(110,110,110,.6);'>" + match + "</span>";
        });
      }
      /* Highlight certain lines */
      arr = strAt.match(/{(\d,?)+}/g); // Match any pattern such as: {1}, {2,3}, {4,5,6}
      lines = strCode.split(/\r?\n|\r/g); // Break string into many lines, and store them to array
      if ( !arr || arr.length === 0 ) return strCode; // Array for exmaple {2,3}
      for ( j = 0; j < arr.length; ++j ) {
        nums = arr[j].substr(1, arr[j].length-2).split(","); // Convert '{2,3}' to array ['2','3']
        if ( !nums || nums.length < 1 ) {
          return strCode;
          break;
        }
        for ( k = 0; k < nums.length; ++k ) {
          m = parseInt(nums[k])-1;
          lines[m] = "<span style='background-color:" + g.bgColors[j] + ";'>" + lines[m] + "</span>";
        }
      }
      strCode = lines.join("\r\n");
      // Returns highlighted code
      arr = re = nums = lines = null;
      return strCode;
    } // highlight
  };
})();
// document.addEventListener("DOMContentLoaded", () => Formatter.init(), false);
document.addEventListener("DOMContentLoaded", function () { Formatter.init(); }, false);
