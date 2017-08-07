/*  cellPos jQuery plugin
    ---------------------
    Get visual position of cell in HTML table (or its block like thead).
    Return value is object with "top" and "left" properties set to row and column index of top-left cell corner.
    Example of use:
        $("#myTable tbody td").each(function(){ 
            $(this).text( $(this).cellPos().top +", "+ $(this).cellPos().left );
        });
*/
(function($){
    /* scan individual table and set "cellPos" data in the form { left: x-coord, top: y-coord } */
    function scanTable( $table ) {
        var m = [];
        $("tr",$table).each( function( y, row ) {
            $("td,th",row).each( function( x, cell ) {
                var $cell = $(cell),
                    cspan = $cell.attr( "colspan" ) | 0,
                    rspan = $cell.attr( "rowspan" ) | 0,
                    tx, ty;
                cspan = cspan ? cspan : 1;
                rspan = rspan ? rspan : 1;
                for( ; m[y] && m[y][x]; ++x );  //skip already occupied cells in current row
                for( tx = x; tx < x + cspan; ++tx ) {  //mark matrix elements occupied by current cell with true
                    for( ty = y; ty < y + rspan; ++ty ) {
                        if( !m[ty] ) {  //fill missing rows
                            m[ty] = [];
                        }
                        m[ty][tx] = true;
                    }
                }
                var pos = { top: y, left: x };
                $cell.data( "cellPos", pos );
            } );
        } );
    };

    /* plugin */
    $.fn.cellPos = function( rescan ) {
        var $cell = this.first(),
            pos = $cell.data( "cellPos" );
        if( !pos || rescan ) {
        	//table, thead, tbody, tfoot内的Cell的pos分开记
            //var $table = $cell.closest( "table, thead, tbody, tfoot" );
        	var $table = $cell.closest( "table" );
            scanTable( $table );
        }
        pos = $cell.data( "cellPos" );
        return pos;
    };
})(jQuery);