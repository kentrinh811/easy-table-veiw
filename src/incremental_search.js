$(function() {
    var data;
    var searched_data;
    var row_num = 100;
    var dst_field = document.getElementsByTagName('tbody')[0];
    var current_index = -1;
    var data_total = -1;
    var input_form_default_word = 'input search query';
    var data_url = 'http://localhost/~kosei/incremental_search_simple/resources/test_set.json';
    var dom_selectors = {
      'search_form': '#input-form',
      'total_hit': '#total',
      'paging_next': '#next',
      'paging_prev': '#prev',
      'paging_current_page': '#page-current',
      'paging_total_page': '#page-total'
    };

    $.getJSON(data_url, 
              function(json) {
                init();
                searched_data = data = json;
                current_index = 0;
                updateTotalItem(data.length);
                updatePageNumber(current_index);
                showTable(json);
              });

    function showTable(json, begin_index) {
      var begin = begin_index || 0;
      var html = makeTable(json, begin);
      insertHtml(html);
    }

    function makeTable(json, begin) {
      var html = '';
      for (var i=0, c=json[i+begin]; c && i < row_num; c=json[++i + begin]) {
        html += '<tr><td>' + c.join('</td><td>') + '</td></tr>';
      }
      return html;
    }

    function insertHtml(html) {
      dst_field.innerHTML = html;
    }

    function updateTotalItem(n) {
      data_total = n;
      $(dom_selectors.total_hit).html(data_total);
    }

    function updatePageNumber(n) {
      $(dom_selectors.paging_current_page).html(parseInt(current_index / row_num, 10) + 1);
      $(dom_selectors.paging_total_page).html(parseInt((data_total / row_num) + 0.9, 10));
    }

    function init() {
      $(dom_selectors.paging_next).click(onclick_next);
      $(dom_selectors.paging_prev).click(onclick_prev);
		  $(dom_selectors.search_form).keyup(onkeyup).focus(onfocus_input_form).blur(onblur_input_form).val(input_form_default_word);
    }

    function onclick_prev(event) {
      if (current_index < row_num) {
        return false;
      }
      current_index -= row_num;
      updatePageNumber(current_index);
      showTable(searched_data, current_index);
    }

    function onclick_next(event) {
      if (current_index + row_num > data_total) {
        return false;
      }
      current_index += row_num;
      updatePageNumber(current_index);
      showTable(searched_data, current_index);
    }

    function onkeyup() {
      current_index = 0;

      // prepare regexp
      var query_regexp = $.map($.trim(this.value).replace('　', ' ', 'gi').split(' '), function(x) {
                                 if (x != '') {
                                   return new RegExp(x, 'i'); 
                                 }
                               });

      // if there is no query string
      if (query_regexp.length <= 0) {
        updateTotalItem(data.length);
        updatePageNumber(current_index);
        showTable(data);
        return false;
      }
      
      // search matched rows
      var searched = [];
      for (var i=0, row=data[i]; row; row=data[++i]) {
        var text = [row[0], row[1], row[2]];
        var found =false;
        for (var j=0, reg=query_regexp[j]; reg; reg=query_regexp[++j]) {
          for (var k=0, query=text[k]; query; query=text[++k]) {
            var tmp = query.search(reg);
            if (tmp != -1) {
              found = true;
            }
          }
        }
        found && searched.push(row);
      }
      
      // show results
      searched_data = searched;
      updateTotalItem(searched_data.length);
      updatePageNumber(current_index);
      showTable(searched);
    }

    function onfocus_input_form() {
      if($(this).val() == $(this).attr('defaultValue'))
        $(this).css('color', '#000').val('');
    }

    function onblur_input_form() {
      if($.trim($(this).val()) == "") {
        $(this).css('color', '#ccc').val($(this).attr('defaultValue'));
      }
    }
  });