import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const Dimensions = {
  Accountability: { label: 'A', name: 'Accountability' },
  Explainability: { label: 'EI', name: 'Explainability' },
  Data: { label: 'D', name: 'Data quality and rights' },
  Bias: { label: 'B', name: 'Bias and fairness' },
  Robustness: { label: 'R', name: 'Robustness' },
};

/**
 * Function adds the Header and Logo from the survey to the PDF.
 */
function addHeader(doc, y) {
  const title = 'Responsible AI Design Report Card';
  const img = new Image();
  img.src = '../img/rail-logo.jpg';
  const iw = 1403,
    ih = 507,
    ratio = 0.025;
  doc.addImage(
    img,
    'jpg',
    10,
    10,
    Math.floor(iw * ratio),
    Math.floor(ih * ratio)
  );
  doc.setFontSize(24);
  doc.text(
    title,
    doc.internal.pageSize.getWidth() / 2,
    y,
    null,
    null,
    'center'
  );
  y += doc.getTextDimensions(title).h + 5; // padding
  return y;
}

/**
 * Function adds the Title and Description of the project surveyed to the PDF.
 */
function addTitleDescription(
  title,
  description,
  region,
  industry,
  risk,
  doc,
  y
) {
  doc.setFontSize(16);
  doc.text(title, 10, y);

  if (region || industry) {
    y += doc.getTextDimensions(title).h + 1;
    doc.setFontSize(10);

    let RI = [];
    if (risk) {
      RI.push('Risk Level: ' + risk);
    }

    if (region) {
      RI.push('Region: ' + region);
    }
    if (industry) {
      RI.push('Industry: ' + industry);
    }

    //"Region: " + region + "    Industry: " + industry;
    doc.text(RI.join('      '), 10, y);
  }

  y += 2; // Padding between title and horizontal line.
  doc.setDrawColor(0, 0, 0);

  doc.line(10, y, 200, y); // Horizontal line.
  y += doc.getTextDimensions(title).h + 1; // Padding between title.
  doc.setFontSize(10);
  let length = 118;

  for (let i = 0; i < description.length; i += length) {
    doc.text(description.substring(i, i + length), 15, y);
    y += doc.getTextDimensions(description.substring(i, i + length)).h + 1;
  }
  y += 10; // padding
  return y;
}

/**
 * Function adds the About section from the results of the survey to the PDF.
 */
function addAbout(doc, y) {
  const title = 'About the Design Assistant';
  doc.setFontSize(16);
  doc.text(title, 10, y);
  y += 1; // Padding between title and horizontal line.
  doc.setDrawColor(0, 0, 0);
  doc.line(10, y, 200, y); // Horizontal line.
  y += doc.getTextDimensions(title).h + 1; // Padding between title.
  doc.setFontSize(10);
  // Custom add text function.
  const addText = (text, x, y) => {
    const length = 118;
    const words = text.split(' ');
    let tmpY = y;
    let line = '';
    const add = () => {
      doc.text(line, x, tmpY);
      tmpY += doc.getTextDimensions(line).h + 1;
      line = '';
    };
    const addLink = (tmp) => {
      let match;
      do {
        let match = /(\[(?:\[??[^[]*?\]))(\((?:\(??[^(]*?\)))/g.exec(tmp);
        if (match) {
          const text = match[1].substring(1, match[1].length - 1);
          const newTmp = tmp.replace(match[0], text);
          if (newTmp.length >= length) {
            break;
          }
          tmp = newTmp;
          const url = match[2].substring(1, match[2].length - 1);
          doc.textWithLink(
            text,
            x + doc.getTextDimensions(tmp.substring(0, tmp.indexOf(text))).w,
            tmpY,
            { url: url }
          );
        }
      } while (match);
      return tmp;
    };
    let tmpBeforeLink = '';
    let linkFound = false;
    let index = -1;
    for (let i = 0; i < words.length; i++) {
      let tmp = line;
      if (words[i].charAt(0) === '[') {
        tmpBeforeLink = tmp;
        linkFound = true;
        index = i - 1;
      }
      if (words[i].charAt(words[i].length - 1) === ')') {
        linkFound = false;
      }
      tmp += words[i];
      if (i < words.length - 1) {
        tmp += ' ';
      }
      tmp = addLink(tmp);
      if (tmp.length >= length) {
        if (linkFound) {
          i = index;
          line = tmpBeforeLink;
          linkFound = false;
        } else {
          i--;
        }
        add();
      } else {
        line = tmp;
      }
    }
    if (line !== '') {
      line = addLink(line);
      add();
    }
    return tmpY - y;
  };
  // Add about text to pdf.
  const text = [
    "As AI continues to evolve so will the Design Assistant. We are working now to add questions that are more industry specific and tailored for your location. To do this, we can use your help! Share with us the results of your report. Let us know where you need more clarification, and where more guidance might be needed. If you weren't ready to answer all of the questions today, that's ok, save your report, and you can reload it the next time you return.",
    'As an open source tool, we will continue to adjust quickly based on our communities needs. Please let us know if you find any issues and we will be happy to update!',
    'If you are wondering what to do with your results, and how you can improve, check out the [Responsible AI Design Assistant Guide](https://docs.google.com/document/d/1eEMZkY139xO557Tv8rV7zlahycZUdkarr-YJftwkU20/edit#heading=h.l9n4rt31jkfh) that includes definitions and lots of additional information. If you are in need of additional support, contact us, and we can put you in touch with a trusted service provider.',
    'Since we want you to use the Design Assistant early and often, you can click the button below to start over again!',
  ];
  for (let i = 0; i < text.length; i++) {
    y += addText(text[i], 15, y);
    if (i < text.length - 1) {
      y += 2;
    }
  }
  y += 10;
  return y;
}

/**
 * Function adds the dimension score from the results of the survey to the PDF.
 */
function addScore(doc, y) {
  // Base64 FontAwesomes icons.
  const checkCircle =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAoAAAAKABXX67owAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAHfSURBVDiNldTPb01REAfwT5s+RFpEYtPyamXVVztBJMSGjd/8AVLpRizaf0HKwk4sxY/uRMRKEQn9E7T8B3hLBO1rRDyLMzf39r17b/Wb3Jw7c2a+Z87MmRlQjxGcxgRGQ/cFH/EaPzfw78M45rGGbsW3hsdolhEMlOimcRdbQ17CIj6FvA8ncDDkNdzA/bpIbxcieoFWjW0rbDL7uSrD6TD4g5m603swGz5dTPVu7pfnczOkGWbCt6Mn5/Py628G2wv/C8HxMFOMyKOty2kvDuEbboU8WYh6GK6E4v0mSA/je4Fod+iXQndpUHr88O4/SY9IzbFTuukFfI29xVhbg9Z3VIYJ3MGWHtKjeIUdEen5kDN8jnV0qCSiXXiLPTggpeo3jkkFGgnSc3hTda1BtON/b6w/5Gk5iyc4iZdBuoozFaQZRxsu6y/eEJ7Ku+pvrCtxSBWWw+4i1c+tgWcF8l/SjKhC33ODR8obpIHn0ng8XkNK3iAPisrxOKmspRsY24B0NnxXpem3DtfkQ2h2A6Je0mwIXa0ympPndEHKWxUm5dfv4mZxs2zQT+EetoW8bP2gb0pFzArdwXWF4VOHplTQLO9lX0cqVF9OqyIuYhinIrqxIGzjg9TKK1WO/wBzvo3rvEdWdAAAAABJRU5ErkJggg==';
  const circle =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAXCAYAAADgKtSgAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAqAAAAKgBefSzxgAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAGoSURBVEiJrdXLThRBFAbgj3bYsVEYXCgTFmoyE4kujRslPII+A8o7kIkP5EPoxstGNIrXCRth4Q1BlkrGRVVlKk332M7wJ53qU1XnP1V1qv4z49+4htu4iLP4ic94jFcN/E9gFhvYwXDMt4P7aFWRzFT09fAQ3Wgf4wkG+IpFXMJNnIlz3uFObGuxhsO4qkNsYr5m7gL6+BXnH0T/SvQy4hdYGreKDB1sZQG65QmzeJsRzzUkTpjLAmwr5WDD6CiarriMjtER3csH0q3YnJA4oR95Bqnjeuz4IyRpGszjd+RbKXArDjzF9ynJf+B5/F8thJcHH6YkTvgY2wsFzkVj/5TI0+4XCmEr1D+W/0U7tt8K7EXjyimRJ549guql29Ku82iIxcgzxNXUme55f0ryB0r3nCCbQ+GFdSYkXsZR5FnPB1pG2rJlMm15Gf3fqND3rqBqKUDTHSxnxJWqmLCWBTgSclCX5LZwxukoTuh5VSXqCpWoF+1jPMMnfMF5XMYNo0q0jbt4X7fqHC1BNgfG19CBkLzGNbSMFaH6LwnVfx+7eITX4xz/ApJjdwVAbpi0AAAAAElFTkSuQmCC';
  const title = 'Results Overview';
  doc.setFontSize(16);
  doc.text(title, 10, y);
  y += 1; // Padding between title and horizontal line.
  doc.setDrawColor(0, 0, 0);
  doc.line(10, y, 200, y); // Horizontal line.
  y += doc.getTextDimensions(title).h + 1; // Padding between title.
  // Add table to pdf.
  doc.autoTable({
    startY: y,
    html: '#score',
    didParseCell: (data) => {
      // Style cells.
      if (data.section === 'head') {
        data.cell.styles.textColor = '#000000';
        if (data.cell.text[0] === 'Dimensions') {
          data.cell.styles.fillColor = '#BFBFBF';
        } else {
          data.cell.styles.fillColor = '#D0E0E3';
        }
      } else if (data.section === 'body' && data.column.index === 0) {
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.textColor = '#000000';
      }
    },
    didDrawCell: (data) => {
      // Draw cell border
      doc.setDrawColor(222, 226, 230);
      doc.line(
        data.cell.x,
        data.cell.y,
        data.cell.x + data.column.width,
        data.cell.y
      );
      doc.line(
        data.cell.x,
        data.cell.y,
        data.cell.x,
        data.cell.y + data.row.height
      );
      doc.line(
        data.cell.x + data.column.width,
        data.cell.y,
        data.cell.x + data.column.width,
        data.cell.y + data.row.height
      );
      doc.line(
        data.cell.x,
        data.cell.y + data.row.height,
        data.cell.x + data.column.width,
        data.cell.y + data.row.height
      );
      // Add images
      const td = data.cell.raw;
      const img = td.getElementsByTagName('svg')[0];
      if (img !== undefined) {
        const dim = data.cell.height - data.cell.padding('vertical');
        const textPos = data.cursor;
        if (img.classList.value.indexOf('fa-check-circle') !== -1) {
          doc.addImage(
            checkCircle,
            textPos.x + data.cell.width / 2 - dim,
            textPos.y,
            dim,
            dim
          );
        } else if (img.classList.value.indexOf('fa-circle') !== -1) {
          doc.addImage(
            circle,
            textPos.x + data.cell.width / 2 - dim,
            textPos.y,
            dim,
            dim
          );
        }
      }
    },
  });
  y += 60;
  return y;
}

/**
 * Function adds the report card from the results of the survey to the PDF.
 */
function addReportCard(doc, y) {
  const title = 'Detailed Report';
  doc.setFontSize(16);
  doc.text(title, 10, y);
  y += 1; // Padding between title and horizontal line.
  doc.setDrawColor(0, 0, 0);
  doc.line(10, y, 200, y); // Horizontal line.
  y += doc.getTextDimensions(title).h + 2; // Padding between title.
  // Add table to pdf.
  for (let name in Dimensions) {
    doc.setFontSize(14);
    doc.text(Dimensions[name].name, 12, y);
    y += doc.getTextDimensions(name).h;
    doc.autoTable({
      startY: y,
      html: '#report-card-' + Dimensions[name].label,
      tableWidth: 'auto',
      columnWidth: 'wrap',
      columnStyles: {
        0: { cellWidth: 48 },
        1: { cellWidth: 48 },
        2: { cellWidth: 48 },
        3: { cellWidth: 'auto' },
      },
      didParseCell: (data) => {
        // Style cells.
        data.cell.styles.textColor = '#000000';
        if (data.section === 'head') {
          data.cell.styles.fillColor = '#D0E0E3';
        } else if (data.section === 'body') {
          data.cell.styles.fillColor = '#FFFFFF';
        }
      },
      didDrawCell: (data) => {
        // Draw cell border.
        doc.setDrawColor(222, 226, 230);
        doc.line(
          data.cell.x,
          data.cell.y,
          data.cell.x + data.column.width,
          data.cell.y
        );
        doc.line(
          data.cell.x,
          data.cell.y,
          data.cell.x,
          data.cell.y + data.row.height
        );
        doc.line(
          data.cell.x + data.column.width,
          data.cell.y,
          data.cell.x + data.column.width,
          data.cell.y + data.row.height
        );
        doc.line(
          data.cell.x,
          data.cell.y + data.row.height,
          data.cell.x + data.column.width,
          data.cell.y + data.row.height
        );
      },
      // eslint-disable-next-line
      didDrawPage: (data) => {
        // Reset y position.
        doc.pageNumber++;
        y = 20;
      },
    });
    y += doc.previousAutoTable.finalY;
  }
  return y;
}

/**
 * exports the results of the survey to PDF.
 * @param title
 * @param description
 */
export function exportReport(title, description, industry, region, risk) {
  const doc = new jsPDF();
  // eslint-disable-next-line
  var y = 35;
  y = addHeader(doc, y);
  if (
    title !== undefined ||
    description !== undefined ||
    region ||
    industry ||
    risk
  ) {
    y = addTitleDescription(
      title ?? ' ',
      description ?? ' ',
      region,
      industry,
      risk,
      doc,
      y
    );
  }

  y = addAbout(doc, y);
  y = addScore(doc, y);
  addReportCard(doc, y);
  doc.save('Responsible AI Design Report Card.pdf');
}

export default exportReport;
