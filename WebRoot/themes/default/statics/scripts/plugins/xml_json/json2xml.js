/*	This work is licensed under Creative Commons GNU LGPL License.

	License: http://creativecommons.org/licenses/LGPL/2.1/
   Version: 0.9
	Author:  Stefan Goessner/2006
	Web:     http://goessner.net/ 
*/
function json2xml(o,attrTag, tab,options) {
	var _type=typeof(o);
	if(_type=="string"){
		o=JSON.parse(o);
	}
	tab=tab||"";
	attrTag=attrTag||"_";
	options=options||{};
	var ignoreTag=options.ignoreTag||"$";
   var toXml = function(v, name, ind) {
      var xml = "";
      if (v instanceof Array) {
         for (var i=0, n=v.length; i<n; i++)
            xml += toXml(v[i], name, ind);
      }
      else if (typeof(v) == "object") {
         var hasChild = false;
         xml += ind + "<" + name;
         for (var m in v) {
            if (m.charAt(0) == attrTag){
            	xml += " " + m.substr(1) + "=\"" + v[m].toString() + "\"";
            }else if(m.charAt(0) != ignoreTag){
                hasChild = true;
            }
         }
         xml += hasChild ? ">\n" : "/>\n";
         if (hasChild) {
            for (var m in v) {
               if (m == "#text")
                  xml += v[m];
               else if (m == "#cdata")
                  xml += "<![CDATA[" + v[m] + "]]>";
               else if (m.charAt(0) != attrTag&&m.charAt(0) != ignoreTag)
                  xml += toXml(v[m], m, ind+"\t");
            }
            xml += (xml.charAt(xml.length-1)=="\n"?ind:"") + "</" + name + ">"+"\n";
         }
      }
      else {
         xml += ind + "<" + name + ">" + v.toString() +  "</" + name + ">"+"\n";
      }
      return xml;
   }, xml="";
   for (var m in o)
      xml += toXml(o[m], m, "");
   return tab ? xml.replace(/\t/g, tab) : xml.replace(/\t|\n/g, "");
}
