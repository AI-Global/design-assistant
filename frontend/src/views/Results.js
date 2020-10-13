import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css"
import "font-awesome/css/font-awesome.css"
import { Tabs, Tab, Table, Button, Nav } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faCircle } from '@fortawesome/free-regular-svg-icons'
import "../css/results.css"
import { ResponsiveRadar } from "@nivo/radar";
import {jsPDF} from "jspdf";
import {autoTable} from "jspdf-autotable";

const Dimensions = {
    Accountability: {label: "A", name: "Accountability"},
    Explainability: {label: "EI", name: "Explainability"},
    Data: {label: "D", name: "Data quality and rights"},
    Bias: {label: "B", name: "Bias and fairness"},
    Robustness: {label: "R", name: "Robustness"},
}

const QuestionTypes = 
{
    checkbox: "checkbox",
    radiogroup: "radiogroup"
}

var radarChartData = [];

export default class Results extends Component {


    addHeader(doc, y){
        const title = "Responsible AI Design Report Card";
        const img = new Image();
        img.src = '../img/aiglobal-logo.jpg';
        const iw = 1403, ih = 507, ratio = 0.025;
        doc.addImage(img, 'jpg', 10, 10, Math.floor(iw * ratio), Math.floor(ih * ratio));
        doc.setFontSize(24);
        doc.text(title, doc.internal.pageSize.getWidth() / 2, y, null, null, "center");
        y += doc.getTextDimensions(title).h + 5; // padding
        return y;
    }
    addAbout(doc, y) {
        const title = "About the Design Assistant";
        doc.setFontSize(16);
        doc.text(title, 10, y);
        y += 1; // Padding between title and horizontal line.
        doc.setDrawColor(0, 0, 0);
        doc.line(10, y, 200, y);  // Horizontal line.
        y += doc.getTextDimensions(title).h + 1; // Padding between title.
        doc.setFontSize(10);
        // Custom add text function.
        const addText = (text, x, y) => {
          const length = 118;
          const words = text.split(" ");
          let tmpY = y;
          let line = "";
          const add = () => {
            doc.text(line, x, tmpY);
            tmpY += doc.getTextDimensions(line).h + 1;
            line = "";
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
                  doc.textWithLink(text, x + doc.getTextDimensions(tmp.substring(0, tmp.indexOf(text))).w, tmpY, { url: url });
                }
            } while (match);
            return tmp;
          };
          let tmpBeforeLink = "";
          let linkFound = false;
          let index = -1;
          for (let i = 0; i < words.length; i++) {
            let tmp = line;
            if (words[i].charAt(0) === "[") {
              tmpBeforeLink = tmp;
              linkFound = true;
              index = i - 1;
            }
            if (words[i].charAt(words[i].length - 1) === ")") {
              linkFound = false;
            }
            tmp += words[i];
            if (i < words.length - 1) {
              tmp += " ";
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
          if (line !== "") {
            line = addLink(line);
            add();
          }
          return tmpY - y;
        };
        // Add about text to pdf.
        const text = [
          "As AI continues to evolve so will the Design Assistant. We are working now to add questions that are more industry specific and tailored for your location. To do this, we can use your help! Share with us the results of your report. Let us know where you need more clarification, and where more guidance might be needed. If you weren't ready to answer all of the questions today, that's ok, save your report, and you can reload it the next time you return.",
          "As an open source tool, we will continue to adjust quickly based on our communities needs. Please let us know if you find any issues and we will be happy to update!",
          "If you are wondering what to do with your results, and how you can improve, check out the [Responsible AI Design Assistant Guide](https://docs.google.com/document/d/1eEMZkY139xO557Tv8rV7zlahycZUdkarr-YJftwkU20/edit#heading=h.l9n4rt31jkfh) that includes definitions and lots of additional information. If you are in need of additional support, contact us, and we can put you in touch with a trusted service provider.",
          "Since we want you to use the Design Assistant early and often, you can click the button below to start over again!"
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
    addScore(doc, y) {
        const checkCircle = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAoAAAAKABXX67owAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAHfSURBVDiNldTPb01REAfwT5s+RFpEYtPyamXVVztBJMSGjd/8AVLpRizaf0HKwk4sxY/uRMRKEQn9E7T8B3hLBO1rRDyLMzf39r17b/Wb3Jw7c2a+Z87MmRlQjxGcxgRGQ/cFH/EaPzfw78M45rGGbsW3hsdolhEMlOimcRdbQ17CIj6FvA8ncDDkNdzA/bpIbxcieoFWjW0rbDL7uSrD6TD4g5m603swGz5dTPVu7pfnczOkGWbCt6Mn5/Py628G2wv/C8HxMFOMyKOty2kvDuEbboU8WYh6GK6E4v0mSA/je4Fod+iXQndpUHr88O4/SY9IzbFTuukFfI29xVhbg9Z3VIYJ3MGWHtKjeIUdEen5kDN8jnV0qCSiXXiLPTggpeo3jkkFGgnSc3hTda1BtON/b6w/5Gk5iyc4iZdBuoozFaQZRxsu6y/eEJ7Ku+pvrCtxSBWWw+4i1c+tgWcF8l/SjKhC33ODR8obpIHn0ng8XkNK3iAPisrxOKmspRsY24B0NnxXpem3DtfkQ2h2A6Je0mwIXa0ympPndEHKWxUm5dfv4mZxs2zQT+EetoW8bP2gb0pFzArdwXWF4VOHplTQLO9lX0cqVF9OqyIuYhinIrqxIGzjg9TKK1WO/wBzvo3rvEdWdAAAAABJRU5ErkJggg==";
        const circle = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAXCAYAAADgKtSgAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAqAAAAKgBefSzxgAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAGoSURBVEiJrdXLThRBFAbgj3bYsVEYXCgTFmoyE4kujRslPII+A8o7kIkP5EPoxstGNIrXCRth4Q1BlkrGRVVlKk332M7wJ53qU1XnP1V1qv4z49+4htu4iLP4ic94jFcN/E9gFhvYwXDMt4P7aFWRzFT09fAQ3Wgf4wkG+IpFXMJNnIlz3uFObGuxhsO4qkNsYr5m7gL6+BXnH0T/SvQy4hdYGreKDB1sZQG65QmzeJsRzzUkTpjLAmwr5WDD6CiarriMjtER3csH0q3YnJA4oR95Bqnjeuz4IyRpGszjd+RbKXArDjzF9ynJf+B5/F8thJcHH6YkTvgY2wsFzkVj/5TI0+4XCmEr1D+W/0U7tt8K7EXjyimRJ549guql29Ku82iIxcgzxNXUme55f0ryB0r3nCCbQ+GFdSYkXsZR5FnPB1pG2rJlMm15Gf3fqND3rqBqKUDTHSxnxJWqmLCWBTgSclCX5LZwxukoTuh5VSXqCpWoF+1jPMMnfMF5XMYNo0q0jbt4X7fqHC1BNgfG19CBkLzGNbSMFaH6LwnVfx+7eITX4xz/ApJjdwVAbpi0AAAAAElFTkSuQmCC";
        const title = "Results Overview";
        doc.setFontSize(16);
        doc.text(title, 10, y);
        y += 1; // Padding between title and horizontal line.
        doc.setDrawColor(0, 0, 0);
        doc.line(10, y, 200, y);  // Horizontal line.
        y += doc.getTextDimensions(title).h + 1; // Padding between title.
        // Base64 FontAwesomes icons.
        // Add table to pdf. 
        doc.autoTable( {
            startY: y,

            html: '#score',
            didParseCell: (data) => {
              // Style cells.
              if (data.section === "head") {
                data.cell.styles.textColor = "#000000";
                if (data.cell.text[0] === "Dimensions") {
                  data.cell.styles.fillColor = "#BFBFBF";
                } else {
                  data.cell.styles.fillColor = "#D0E0E3";
                }
              } else if (data.section === "body" && data.column.index === 0) {
                data.cell.styles.fontStyle = "bold";
                data.cell.styles.textColor = "#000000";
              }
            },
            didDrawCell: (data) => {
              // Draw cell border
              doc.setDrawColor(222, 226, 230);
              doc.line(data.cell.x, data.cell.y, data.cell.x + data.column.width, data.cell.y);
              doc.line(data.cell.x, data.cell.y, data.cell.x, data.cell.y + data.row.height);
              doc.line(data.cell.x + data.column.width, data.cell.y, data.cell.x + data.column.width, data.cell.y + data.row.height);
              doc.line(data.cell.x, data.cell.y + data.row.height, data.cell.x + data.column.width, data.cell.y + data.row.height);
              // Add images
              const td = data.cell.raw;
              const img = td.getElementsByTagName('svg')[0];
              if (img !== undefined) {
                const dim = data.cell.height - data.cell.padding('vertical');
                const textPos = data.cursor;
                if (img.classList.value.indexOf('fa-check-circle') !== -1) {
                  doc.addImage(checkCircle, textPos.x + data.cell.width / 2 - dim, textPos.y, dim, dim)
                } else if (img.classList.value.indexOf('fa-circle') !== -1) {
                  doc.addImage(circle, textPos.x + data.cell.width / 2 - dim, textPos.y, dim, dim)
                }
              }
            }
        });
        y += 60;
        return y;
    }
    addReportCard(doc, y) {
        const title = "Detailed Report";
        doc.setFontSize(16);
        doc.text(title, 10, y);
        y += 1; // Padding between title and horizontal line.
        doc.setDrawColor(0, 0, 0);
        doc.line(10, y, 200, y);  // Horizontal line.
        y += doc.getTextDimensions(title).h + 2; // Padding between title.
        // Base64 FontAwesomes icons.
        // Add table to pdf. 
        for (let name in Dimensions){
            console.log(Dimensions[name].label)
            doc.setFontSize(14);
            doc.text(Dimensions[name].name, 12, y);
            y += doc.getTextDimensions(name).h;
            doc.autoTable( {
                startY: y,

                html: '#report-card-' + Dimensions[name].label,
                columnStyles: {
                    0: {cellWidth: 60},
                    1: {cellWidth: 60},
                    2: {cellWidth: 60},
                },
                didParseCell: (data) => {
                // Style cells.
                data.cell.styles.textColor = "#000000";
                if (data.section === "head") {
                    data.cell.styles.fillColor = "#D0E0E3";
                }
                },
                didDrawCell: (data) => {
                    // Draw cell border.
                    doc.setDrawColor(222, 226, 230);
                    doc.line(data.cell.x, data.cell.y, data.cell.x + data.column.width, data.cell.y);
                    doc.line(data.cell.x, data.cell.y, data.cell.x, data.cell.y + data.row.height);
                    doc.line(data.cell.x + data.column.width, data.cell.y, data.cell.x + data.column.width, data.cell.y + data.row.height);
                    doc.line(data.cell.x, data.cell.y + data.row.height, data.cell.x + data.column.width, data.cell.y + data.row.height);
                },
                didDrawPage: (data) => {
                // Reset y position.
                    doc.pageNumber++;
                    y = 20;
                }
            });
            y += doc.previousAutoTable.finalY;
        }
        return y;
    }

    exportReport(){
        const doc = new jsPDF();
        var y = 35;
        y = this.addHeader(doc, y);
        y = this.addAbout(doc, y);
        y = this.addScore(doc, y);
        y = this.addReportCard(doc, y);
        doc.save('Responsible AI Design Report Card.pdf')   
    }




    DisplayQuestion(result, question){     
        var choices = question?.choices?.filter((choice) => result.includes(choice?.value));     
        return (
            <tr key={question?.name}>
                <td>
                    {question?.title?.default.split("\n").map(function(item, idx) {
                        return (
                            <span key={idx}>
                                {item}
                                <br/>
                            </span>
                        )
                    })}
                </td>
                <td>
                    {choices.map(choice => {
                        return (
                            choice?.text?.default.split("\n").map(function(item, idx) {
                                return (
                                    <span key={idx}>
                                        {item}
                                        <br/>
                                    </span>
                                )
                            })
                        )
                    })}
                </td>
                <td>
                    {question?.recommendation?.default.split("\n").map(function(item, idx) {
                        return (
                            <span key={idx}>
                                {item}
                                <br/>
                            </span>
                        )
                    })}
                </td>
            </tr>
        )
    }

    CreateReportCard(dimension, results, questions){
        return (
            <div className="report-card mt-3">
                <Table id={"report-card-"+ dimension} bordered responsive className="report-card-table">
                    <thead>
                        <tr role="row">
                            <th role="columnheader" scope="col" className="report-card-headers">
                                <div>
                                    Question
                                </div>
                            </th>
                            <th role="columnheader" scope="col" className="report-card-headers">
                                <div>
                                    Your Response
                                </div>
                            </th>
                            <th role="columnheader" scope="col" className="report-card-headers">
                                <div>
                                    Recommendation
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {questions.map(question => {
                            return this.DisplayQuestion(results[question?.name], question)
                        })}
                    </tbody>
                </Table>
            </div>
        );
    }   

    CalculateDimensionScore(dimensionName, results, questions){
        var dimensionScore = 0;
        var maxDimensionScore = 0;
        questions.map(question => {
            var selectedChoices = results[question.name];
            var scores = question.score;
            if(question.type === QuestionTypes.checkbox){
                maxDimensionScore += scores.max;
                if(selectedChoices !== undefined){
                    selectedChoices.map(choice => {
                        dimensionScore += scores.choices[choice];
                        return dimensionScore;
                    })
                }
                return dimensionScore;
            }
            else if(question.type === QuestionTypes.radiogroup){
                var maxScore = 0;
                Object.entries(scores.choices).map(choice => {
                    if(selectedChoices !== undefined){
                        if(choice[0] === selectedChoices){
                            dimensionScore += choice[1];
                        }
                    }
                    if(choice[1] > maxScore){
                        maxScore = choice[1];
                    }
                    return dimensionScore;
                });
                maxDimensionScore += maxScore;
            }
            return dimensionScore;
        });
        var percentageScore = (dimensionScore/maxDimensionScore)*100;
        radarChartData.push({"dimension": dimensionName, "score": percentageScore});
        return (
            <tr key={dimensionName}>
                <th scope="row" className="score-card-dimensions">{dimensionName}</th>
                <td className="text-center">
                    {(percentageScore < 50) 
                        ? <FontAwesomeIcon icon={faCheckCircle} size="lg" />
                        : <FontAwesomeIcon icon={faCircle} size="lg" color="#dee2e6" />
                    }
                    
                </td>
                <td className="text-center">
                    {(percentageScore >= 50 && percentageScore <= 75)
                        ? <FontAwesomeIcon icon={faCheckCircle} size="lg" />
                        : <FontAwesomeIcon icon={faCircle} size="lg" color="#dee2e6" />
                    }       
                </td>
                <td className="text-center">
                    {(percentageScore > 75)
                        ? <FontAwesomeIcon icon={faCheckCircle} size="lg" />
                        : <FontAwesomeIcon icon={faCircle} size="lg" color="#dee2e6" />
                    }
                </td>
            </tr>
        )
    }

    render() {
        var json = this.props.location.state.questions;
        var surveyResults = this.props.location.state.responses;
        var pages = json["pages"];
        var allQuestions = [];
        pages.map(page => {
            allQuestions = allQuestions.concat(page?.elements);
            return allQuestions
        });
        var projectTitle = surveyResults[(allQuestions[0].name)];
        var projectDescription = surveyResults[(allQuestions[1].name)];
        var questions = allQuestions.filter((question) => Object.keys(surveyResults).includes(question.name))
    

        var unselected = "#dee2e6";
        return (
            <main id="wb-cont" role="main" property="mainContentOfPage" className="container" style={{ paddingBottom: "1rem" }}>
                { projectTitle && <h1>{projectTitle}</h1> }
                { projectDescription && <p>{projectDescription}</p> }
                <h1 className="section-header">
                    Results
                </h1>
                <button id="saveButton" type="button" className="btn btn-save mr-2 btn btn-primary export-button" onClick={this.exportReport.bind(this)}>Export</button>
                <Tabs defaultActiveKey="score">
                    <Tab eventKey="score" title="Score">
                        <div className="table-responsive mt-3">
                            <Table id="score" bordered hover responsive className="report-card-table">
                                <thead>
                                    <tr>
                                        <th className="score-card-dheader">
                                            Dimensions
                                        </th>
                                        <th className="score-card-headers">
                                            Needs to improve
                                        </th>
                                        <th className="score-card-headers">
                                            Acceptable
                                        </th>
                                        <th className="score-card-headers">
                                            Proficient
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.CalculateDimensionScore(Dimensions.Accountability.name, surveyResults, allQuestions.filter(x => x.score?.dimension === Dimensions.Accountability.label))}
                                    {this.CalculateDimensionScore(Dimensions.Explainability.name, surveyResults, allQuestions.filter(x => x.score?.dimension === Dimensions.Explainability.label ))}
                                    {this.CalculateDimensionScore(Dimensions.Data.name, surveyResults, allQuestions.filter(x => x.score?.dimension === Dimensions.Data.label ))}
                                    {this.CalculateDimensionScore(Dimensions.Bias.name, surveyResults, allQuestions.filter(x => x.score?.dimension === Dimensions.Bias.label ))}
                                    {this.CalculateDimensionScore(Dimensions.Robustness.name, surveyResults, allQuestions.filter(x => x.score?.dimension === Dimensions.Robustness.label ))}
                                </tbody>
                            </Table>
                        </div>
                    </Tab>
                    <Tab eventKey="report-card" title="Report Card">
                        <div>
                            <Tab.Container id="left-tabs-example" defaultActiveKey="accountability">
                                <Tab.Content>
                                    <Tab.Pane eventKey="accountability" >
                                        {this.CreateReportCard(Dimensions.Accountability.label, surveyResults, questions.filter(x => x.score?.dimension === Dimensions.Accountability.label ))}
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="explainability">
                                        {this.CreateReportCard(Dimensions.Explainability.label, surveyResults, questions.filter(x => x.score?.dimension === Dimensions.Explainability.label ))}                               
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="data-quality">     
                                        {this.CreateReportCard(Dimensions.Data.label, surveyResults, questions.filter(x => x.score?.dimension === Dimensions.Data.label ))}                              
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="bias-fairness">
                                        {this.CreateReportCard(Dimensions.Bias.label, surveyResults, questions.filter(x => x.score?.dimension === Dimensions.Bias.label ))}                                 
                                    </Tab.Pane>            
                                    <Tab.Pane eventKey="robustness">
                                        {this.CreateReportCard(Dimensions.Robustness.label, surveyResults, questions.filter(x => x.score?.dimension === Dimensions.Robustness.label ))}                                   
                                    </Tab.Pane>                                                                 
                                </Tab.Content>
                                <Nav variant="tabs" className="report-card-nav" defaultActiveKey="accountability">
                                    <Nav.Item>
                                        <Nav.Link eventKey="accountability">
                                            Accountability
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="explainability">
                                            Explainability
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="data-quality">
                                            Data quality and rights
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="bias-fairness">
                                            Bias and fairness
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="robustness">
                                            Robustness
                                        </Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </Tab.Container>
                        </div>
                    </Tab>
                </Tabs>
                <div className="dimension-chart">
                    <ResponsiveRadar
                        data={radarChartData}
                        keys={[ "score" ]}
                        indexBy="dimension"
                        maxValue={100}
                        margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
                        curve="linearClosed"
                        borderWidth={2}
                        gridLevels={5}
                        gridShape="circular"
                        colors="rgb(31, 119, 180)"
                        isInteractive={true}
                        dotSize={8}
                    /> 
                </div>
                <p>
                    As‌ ‌AI‌ ‌continues‌ ‌to‌ ‌evolve‌ ‌so‌ ‌will‌ ‌the‌ ‌Design‌ ‌Assistant.‌ ‌
                    We‌ ‌are‌ ‌working‌ ‌now‌ ‌to‌ ‌add‌ questions‌ ‌that‌ ‌are‌ ‌more‌ ‌industry‌ ‌specific‌ ‌and‌ ‌tailored‌ ‌for‌ ‌your‌ ‌location.‌
                    ‌To‌ ‌do‌ ‌this,‌ ‌we‌ can‌ ‌use‌ ‌your‌ ‌help!‌ ‌Share‌ ‌with‌ ‌us‌ ‌the‌ ‌results‌ ‌of‌ ‌your‌ ‌report.‌
                    ‌Let‌ ‌us‌ ‌know‌ ‌where‌ ‌you‌ ‌need‌ more‌ ‌clarification,‌ ‌and‌ ‌where‌ ‌more‌ ‌guidance‌ ‌might‌ ‌be‌ ‌needed.‌
                    If‌ ‌you‌ ‌weren’t‌ ‌ready‌ ‌to‌ ‌answer‌ ‌all‌ ‌of‌ ‌the‌ ‌questions‌ ‌today,‌ ‌that’s‌ ‌ok,‌ ‌save‌ ‌your‌ ‌report,‌ ‌and‌ you‌ ‌can‌ ‌reload‌ ‌it‌ ‌the‌ ‌next‌ ‌time‌ ‌you‌ ‌return.‌
                </p>
                <p>
                    As‌ ‌an‌ ‌open‌ ‌source‌ ‌tool,‌ ‌we‌ ‌will‌ ‌continue‌ ‌to‌ ‌adjust‌ ‌quickly‌ ‌based‌ ‌on‌ ‌our‌ ‌communities‌ needs.‌
                    ‌Please‌ ‌let‌ ‌us‌ ‌know‌ ‌if‌ ‌you‌ ‌find‌ ‌any‌ ‌issues‌ ‌and‌ ‌we‌ ‌will‌ ‌be‌ ‌happy‌ ‌to‌ ‌update!‌
                </p>
                <p>
                    If‌ ‌you‌ ‌are‌ ‌wondering‌ ‌what‌ ‌to‌ ‌do‌ ‌with‌ ‌your‌ ‌results,‌ ‌and‌ ‌how‌ ‌you‌ ‌can‌ ‌improve,‌ ‌check‌ ‌out‌ the Responsible AI Design Assistant Guide ‌that‌ ‌includes‌ ‌definitions‌ ‌and‌ ‌lots‌ ‌of‌ additional‌ ‌information.‌ ‌
                    If‌ ‌you‌ ‌are‌ ‌in‌ ‌need‌ ‌of‌ ‌additional‌ ‌support,‌ ‌contact‌ ‌us,‌ ‌and‌ ‌we‌ ‌can‌ put‌ ‌you‌ ‌in‌ ‌touch‌ ‌with‌ ‌a‌ ‌trusted‌ ‌service‌ ‌provider.‌
                </p>
                <p>
                    Since‌ ‌we‌ ‌want‌ ‌you‌ ‌to‌ ‌use‌ ‌the‌ ‌Design‌ ‌Assistant‌ ‌early‌ ‌and‌ ‌often,‌ ‌you‌ ‌can‌ ‌click‌ ‌the‌ ‌button‌ below‌ ‌to‌ ‌start‌ ‌over‌ ‌again!‌
                </p>
                <Link to='/'>
                    <Button>Start Again</Button>
                </Link>
            </main>
        );
    }
}