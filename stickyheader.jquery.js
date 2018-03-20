jQuery(document).ready(function ($) {
  var tables = $('table.stickyHeader');

  tables.each(function (i) {
    var table = tables[i];
    var bodyHeight, cutoffTop, cutoffBottom, tableHeight, tableWidth;

    var tableClone = $(table).clone(true).empty().removeClass('stickyHeader');
    var theadClone = $(table).find('thead').clone(true);
    var stickyHeader =  $('<div></div>').addClass('stickyHeader hide').attr('aria-hidden', 'true');
    stickyHeader.append(tableClone).find('table').append(theadClone);
    $(table).after(stickyHeader);

    var headerCells = $(table).find('thead th');
    var headerCellHeight = $(headerCells[0]).height();

    var no_fixed_support = (stickyHeader.css('position') === 'absolute');

    var stickyHeaderCells = stickyHeader.find('th');

    function evaluateHeaderPositionAndSize() {
      bodyHeight = $('body').height()
      tableHeight = $(table).height();
      tableWidth = $(table).width() +
                   Number($(table).css('padding-left').replace(/px/ig,"")) +
                   Number($(table).css('padding-right').replace(/px/ig,"")) +
                   Number($(table).css('border-left-width').replace(/px/ig,"")) +
                   Number($(table).css('border-right-width').replace(/px/ig,""));
      cutoffTop = $(table).offset().top;
      cutoffBottom = tableHeight + cutoffTop - headerCellHeight;

      for (var i = 0, l = headerCells.length; i < l; i++) {
        if (headerCells[i].style.width.length > 0) {
          // This takes into account other scripts that set header width
          // such as DataTables
          stickyHeaderCells[i].style.width = headerCells[i].style.width
        } else {
          stickyHeaderCells[i].style.width = headerCells[i].scrollWidth + 'px'
        }
      }

      stickyHeader.css('width', tableWidth);
    }

    function setClassNames() {
      for (var i = 0; i < stickyHeader.find('th').length; i++) {
        stickyHeader.find('th')[i].className = $(table).find('thead th')[i].className
      }
    }

    evaluateHeaderPositionAndSize()

    window.onresize = function () {
      evaluateHeaderPositionAndSize()
    }

    // Sometimes header class names change when clicked
    // such as with dataTables sorting
    $(table).find('th').click(setClassNames)
    stickyHeader.find('th').click(setClassNames)

    $(window).scroll(function() {
      if (bodyHeight !== $('body').height()) {
        evaluateHeaderPositionAndSize()
      }

      var currentPosition = $(window).scrollTop();
      if (currentPosition > cutoffTop && currentPosition < cutoffBottom) {
        stickyHeader.removeClass('hide');
        if (no_fixed_support) {
          stickyHeader.css('top', currentPosition + 'px');
        }
      }
      else {
        stickyHeader.addClass('hide');
      }
    });
  });
});
