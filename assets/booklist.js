// Sortable, filterable book list table.
// Enhances <table id="booklist">: click a header to sort, type in the filter row to filter.
(function () {
  var table = document.getElementById('booklist');
  if (!table) return;

  var MONTHS = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 };

  // Column config: key, type, filter placeholder
  var COLS = [
    { type: 'text', placeholder: 'Filter title' },
    { type: 'text', placeholder: 'Filter author' },
    { type: 'num', placeholder: 'e.g. 1900-1950' },
    { type: 'date', placeholder: 'e.g. 2024 or May' },
    { type: 'rating' }
  ];

  var rows = Array.prototype.slice.call(table.querySelectorAll('tr'));
  var headerRow = rows.shift();
  var tbody = headerRow.parentNode;

  // Data rows have 5 <td>s; separator rows (year dividers) don't.
  var items = rows.map(function (tr, i) {
    var tds = tr.querySelectorAll('td');
    if (tds.length < 5) return { tr: tr, sep: true, idx: i };
    var text = Array.prototype.map.call(tds, function (td) { return td.textContent.trim(); });
    return {
      tr: tr,
      idx: i,
      text: text,
      lower: text.map(function (t) { return t.toLowerCase(); }),
      year: parseFloat(text[2]),
      done: parseDate(text[3]),
      rating: parseFloat(text[4])
    };
  });
  var books = items.filter(function (it) { return !it.sep; });

  function parseDate(s) {
    var m = s.match(/([A-Za-z]+)\s+(\d{4})/);
    if (!m) return NaN;
    return parseInt(m[2], 10) * 12 + (MONTHS[m[1].slice(0, 3).toLowerCase()] || 0);
  }

  // Sort key for a column
  function key(it, col) {
    switch (col) {
      case 2: return it.year;
      case 3: return it.done;
      case 4: return it.rating;
      case 1: return lastName(it.text[1]);
      default: return it.lower[col].replace(/^(the|a|an)\s+/, '');
    }
  }

  function lastName(author) {
    // Sort by surname of the first listed author
    var first = author.split(/,| and | & /)[0].trim();
    var parts = first.split(/\s+/);
    return (parts[parts.length - 1] + ' ' + first).toLowerCase();
  }

  // ---- Build filter row + status line ----
  var ths = headerRow.querySelectorAll('th');
  var filterRow = document.createElement('tr');
  filterRow.className = 'booklist-filters';
  var inputs = COLS.map(function (c, i) {
    var th = document.createElement('th');
    var el;
    if (c.type === 'rating') {
      el = document.createElement('select');
      [['', 'Any'], ['5', '5'], ['4', '4+'], ['3', '3+'], ['2', '2+'], ['1', '1+']].forEach(function (o) {
        var opt = document.createElement('option');
        opt.value = o[0];
        opt.textContent = o[1];
        el.appendChild(opt);
      });
    } else {
      el = document.createElement('input');
      el.type = 'search';
      el.placeholder = c.placeholder;
    }
    el.setAttribute('aria-label', 'Filter ' + ths[i].textContent.trim());
    el.addEventListener('input', apply);
    th.appendChild(el);
    filterRow.appendChild(th);
    return el;
  });
  headerRow.parentNode.insertBefore(filterRow, headerRow.nextSibling);

  var status = document.createElement('div');
  status.className = 'booklist-status';
  var count = document.createElement('span');
  var reset = document.createElement('button');
  reset.type = 'button';
  reset.textContent = 'Reset';
  reset.addEventListener('click', function () {
    inputs.forEach(function (el) { el.value = ''; });
    sortCol = -1;
    apply();
  });
  status.appendChild(count);
  status.appendChild(reset);
  table.parentNode.insertBefore(status, table);

  // ---- Sorting ----
  var sortCol = -1, sortDir = 1;
  Array.prototype.forEach.call(ths, function (th, i) {
    th.classList.add('sortable');
    th.setAttribute('tabindex', '0');
    th.setAttribute('role', 'button');
    function click() {
      if (sortCol !== i) { sortCol = i; sortDir = i >= 2 ? -1 : 1; } // numbers default high→low
      else if ((sortDir === 1) === (i < 2)) { sortDir = -sortDir; }
      else { sortCol = -1; } // third click returns to original order
      apply();
    }
    th.addEventListener('click', click);
    th.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); click(); }
    });
  });

  // ---- Filtering ----
  // Numeric filter: "1990", ">1900", "<1950", "1900-1950"
  function numMatch(val, q) {
    var m;
    if ((m = q.match(/^(\d+)\s*-\s*(\d+)$/))) return val >= +m[1] && val <= +m[2];
    if ((m = q.match(/^([<>]=?)\s*(\d+)$/))) {
      var n = +m[2];
      return m[1] === '>' ? val > n : m[1] === '>=' ? val >= n : m[1] === '<' ? val < n : val <= n;
    }
    return String(val).indexOf(q) !== -1;
  }

  function matches(it) {
    for (var i = 0; i < COLS.length; i++) {
      var q = inputs[i].value.trim().toLowerCase();
      if (!q) continue;
      var t = COLS[i].type;
      if (t === 'rating') { if (!(it.rating >= parseFloat(q))) return false; }
      else if (t === 'num') { if (!numMatch(it.year, q)) return false; }
      else if (it.lower[i].indexOf(q) === -1) return false;
    }
    return true;
  }

  function apply() {
    var filtering = inputs.some(function (el) { return el.value.trim(); });
    var shown = 0;

    var list;
    if (sortCol === -1) {
      list = items; // original order, keep year dividers
    } else {
      list = books.slice().sort(function (a, b) {
        var ka = key(a, sortCol), kb = key(b, sortCol);
        var aBad = ka !== ka, bBad = kb !== kb; // NaN last
        if (aBad || bBad) return aBad - bBad;
        if (ka < kb) return -sortDir;
        if (ka > kb) return sortDir;
        return a.idx - b.idx;
      });
    }

    // Hide all dividers, then re-append in display order
    items.forEach(function (it) { if (it.sep) it.tr.hidden = true; });
    list.forEach(function (it) {
      if (it.sep) {
        it.tr.hidden = filtering || sortCol !== -1;
      } else {
        var ok = matches(it);
        it.tr.hidden = !ok;
        if (ok) shown++;
      }
      tbody.appendChild(it.tr);
    });

    Array.prototype.forEach.call(ths, function (th, i) {
      th.setAttribute('aria-sort', i === sortCol ? (sortDir === 1 ? 'ascending' : 'descending') : 'none');
    });
    count.textContent = shown === books.length
      ? books.length + ' books'
      : 'Showing ' + shown + ' of ' + books.length + ' books';
    reset.hidden = !filtering && sortCol === -1;
  }

  // Filter row sticks just below the header row
  function setStickyOffset() {
    table.style.setProperty('--booklist-filter-top', headerRow.offsetHeight + 'px');
  }
  window.addEventListener('resize', setStickyOffset);
  setStickyOffset();

  apply();
})();
