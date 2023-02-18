import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Dropdown, Button, Modal, Col } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import Loader from 'react-loaders'
import { auth } from './Firebase'
import * as XLSX from 'xlsx'
import { Toast, ToastContainer } from 'react-bootstrap'

function Content() {
  //Getting data
  let [data, setData] = useState(null)
  let [module, setModule] = useState(null)
  let [create, setCreate] = useState(null)
  let [course, setCourse] = useState(null)
  const [error, setError] = useState(null)
  const [show3, setShow3] = useState(false)

  //Obtaining Post and Edit Settings
  let [edit, setEdit] = useState(null)
  let [editValue, setEditValue] = useState(null)
  const [inputFields, setInputFields] = useState([{ options: '', answer: '' }])

  //Error Messages
  let [message, setMessage] = useState(null)

  //Post and Edit input values
  let [question, setQuestion] = useState('')
  let [type, setType] = useState('pick one')
  let [options, setOptions] = useState('')
  let [answer, setAnswer] = useState('')
  let [collectionName, setCollectionName] = useState('')

  //Delete Values for Modules
  let [confirmDelete, setConfirmDelete] = useState(null)
  let [deleting, setDeleting] = useState(null)
  let [isDeleted, setIsDeleted] = useState(null)

  //Determine Access
  let [isOwner, setIsOwner] = useState()

  //File reading
  const [items, setItems] = useState([])
  const [newItems, setNewItems] = useState(null)

  let determineAccess = () => {
    axios
      .get('localhost:5678/user/' + auth.currentUser.uid)
      .then(function (response) {
        // handle success
        setIsOwner(response.data.owner)
      })
      .catch(function (error) {
        // handle error
        if (error.response.status === 400) {
          console.log(error)
          setError('Cant find record')
        } else {
          setError('Unexpected Error')
        }
      })
      .then(function () {
        // always executed
      })
  }
  /*
    Getting all the modules 
  */
  let getFormData = () => {
    axios
      .get('localhost:5678/request')
      .then(function (response) {
        // handle success
        setError(false)
        setModule(response.data)
      })
      .catch(function (error) {
        // handle error
        if (error.response.status === 400) {
          console.log(error)
          setError('Cant find record')
        } else {
          setError('Unexpected Error')
        }
      })
      .then(function () {
        // always executed
      })
  }
  /*
      Getting questions for the selected module
  */
  let getQuestion = (e) => {
    setCreate(null)
    setEdit(false)
    setCourse(e.target.innerText)

    axios
      .get('localhost:5678/request/' + e.target.innerText)
      .then(function (response) {
        // handle success
        setError(false)
        setData(response.data)
      })
      .catch(function (error) {
        // handle error
        if (error.response.status === 400) {
          console.log(error)
          setError('Cant find record')
        } else {
          setError('Unexpected Error')
        }
      })
      .then(function () {
        // always executed
      })
  }
  /*
      Creating new modules
  */
  let createModules = (e) => {
    e.preventDefault()

    axios
      .post('localhost:5678/request', {
        collectionName: collectionName,
      })
      .then(function () {
        // handle success
        setCollectionName('')
        window.location.reload(false)
      })
      .catch(function (error) {
        // handle error
        if (error.response.status === 400) {
          console.log(error)
          setError('Cant find record')
        } else {
          setError('Unexpected Error')
        }
      })
      .then(function () {
        // always executed
      })
  }
  /*
    Delete Modules
  */
  let deleteModulesAppear = (e) => {
    e.preventDefault()
    if (confirmDelete) {
      setConfirmDelete(null)
    }
    if (!confirmDelete) {
      setConfirmDelete(true)
    }
  }

  let confirmingDeletion = (e) => {
    e.preventDefault()
    console.log(deleting)

    if (deleting === course) {
      setIsDeleted('The module has been Deleted')
      axios
        .delete('localhost:5678/request/' + deleting, {})
        .then(function () {
          // handle success
          setDeleting('')
          window.location.reload(false)
        })
        .catch(function (error) {
          // handle error
          if (error.response.status === 400) {
            console.log(error)
            setError('Cant find record')
          } else {
            setError('Unexpected Error')
          }
        })
        .then(function () {
          // always executed
        })
    } else {
      setIsDeleted('Error: The module has not been Deleted')
    }
  }

  /*
    Creates a question
  */
  let createQuestion = (e) => {
    e.preventDefault()

    if (question === '' || options === '' || answer === '' || type === '') {
      setShow3(true)
      setMessage('Missing Fields')
    } else {
      console.log('Success')
      axios
        .post('localhost:5678/request/' + course, {
          question: question,
          type: type,
          options: options,
          answer: answer,
        })
        .then(function () {
          // handle success
          setAnswer('')
          setType('pick one')
          setQuestion('')
          setOptions('')
          setInputFields([{ options: '', answer: '' }])
          setCreate(null)
          refreshPage()
        })
        .catch(function (error) {
          // handle error
          if (error.response.status === 400) {
            console.log(error)
            setError('Cant find record')
          } else {
            setError('Unexpected Error')
          }
        })
        .then(function () {
          // always executed
        })
    }
  }

  let createAppear = () => {
    setCreate(true)
  }

  let EditAppear = () => {
    setEdit(true)
  }

  let deleteQuestion = (e) => {
    axios
      .delete('localhost:5678/request/' + course + '/' + e.target.value)
      .then(function () {
        // handle success
        refreshPage()
      })
      .catch(function (error) {
        // handle error
        if (error.response.status === 400) {
          console.log(error)
          setError('Cant find record')
        } else {
          setError('Unexpected Error')
        }
      })
      .then(function () {
        // always executed
      })
  }

  let editQuestion = (e) => {
    e.preventDefault()

    axios
      .put('localhost:5678/request/' + course + '/' + editValue, {
        question: question,
        type: type,
        options: options.toString().split(','),
        answer: answer.toString().split(','),
      })
      .then(function () {
        // handle success
        setAnswer('')
        setType('pick one')
        setQuestion('')
        setOptions('')
        setCreate(null)
        setEditValue(null)
        refreshPage()
      })
      .catch(function (error) {
        // handle error
        if (error.response.status === 400) {
          console.log(error)
          setError('Cant find record')
        } else {
          setError('Unexpected Error')
        }
      })
      .then(function () {
        // always executed
      })
  }

  let refreshPage = () => {
    /*
        Refreshes the page
    */
    axios
      .get('localhost:5678/request/' + course)
      .then(function (response) {
        // handle success
        setError(false)
        setData(response.data)
      })
      .catch(function (error) {
        // handle error
        if (error.response.status === 400) {
          console.log(error)
          setError('Cant find record')
        } else {
          setError('Unexpected Error')
        }
      })
      .then(function () {
        // always executed
      })
  }

  //Modal
  const [show, setShow] = useState(false)
  const [show2, setShow2] = useState(false)

  const handleClose2 = () => {
    setShow2(false)
    setInputFields([{ options: '', answer: '' }])
  }
  const handleClose = () => {
    setShow(false)
    setInputFields([{ options: '', answer: '' }])
  }
  //create question and show Modal
  const onClick = () => {
    setEditValue('')
    setType('pick one')
    setQuestion('')
    setAnswer('')
    setOptions('')

    createAppear()
    setShow(true)
  }
  const onClick2 = (e) => {
    e.preventDefault()

    if (e.target.parentNode.parentNode.cells[1].innerText === 'pick one') {
      setEditValue(e.target.parentNode.parentNode.cells[0].innerText)
      setType(e.target.parentNode.parentNode.cells[1].innerText)
      setQuestion(e.target.parentNode.parentNode.cells[2].innerText)
      setAnswer(e.target.parentNode.parentNode.cells[3].innerText)
      setOptions(e.target.parentNode.parentNode.cells[4].innerText)
    }
    if (
      e.target.parentNode.parentNode.cells[1].innerText === 'multichoice' ||
      e.target.parentNode.parentNode.cells[1].innerText === 'matching'
    ) {
      let recreateObject = []
      let resultOptions =
        e.target.parentNode.parentNode.cells[4].innerText.split(',')
      let resultAnswer =
        e.target.parentNode.parentNode.cells[3].innerText.split(',')

      for (var i = 0; i < resultOptions.length; i++) {
        recreateObject = [
          ...recreateObject,
          { options: resultOptions[i], answer: resultAnswer[i] },
        ]
      }
      setInputFields(recreateObject)
      setEditValue(e.target.parentNode.parentNode.cells[0].innerText)
      setType(e.target.parentNode.parentNode.cells[1].innerText)
      setQuestion(e.target.parentNode.parentNode.cells[2].innerText)
    }

    EditAppear()
    setShow2(true)
  }

  /*
    Matching Variables
  */
  const handleFormChange = (event, index) => {
    let newData = [...inputFields]
    console.log(newData)
    newData[index][event.target.name] = event.target.value
    setInputFields(newData)

    let answersFound = inputFields.map((a) => a.answer)
    let optionsFound = inputFields.map((a) => a.options)

    setAnswer(answersFound.toString())
    setOptions(optionsFound.toString())
    console.log(answer)
    console.log(options)
  }

  const handleFormChange2 = (event, index) => {
    let newData = [...inputFields]

    newData[index][event.target.name] = event.target.value
    console.log(newData)

    if (event.target.checked === true && event.target.name === 'answer') {
      let tempVariable = newData[index]['options']
      newData[index][event.target.name] = tempVariable
    }
    if (event.target.checked === false && event.target.name === 'answer') {
      let tempVariable = ''
      newData[index][event.target.name] = tempVariable
    }

    setInputFields(newData)

    let answersFound = inputFields.map((a) => a.answer)
    let optionsFound = inputFields.map((a) => a.options)
    let modified = answersFound.filter((n) => n)

    setAnswer(modified.toString())
    setOptions(optionsFound.toString())
    console.log(answer)
    console.log(options)
  }
  const addFields = (e) => {
    e.preventDefault()
    let object = {
      options: '',
      answer: '',
    }

    setInputFields([...inputFields, object])
  }

  const removeFields = (index) => {
    let newData = [...inputFields]
    newData.splice(index, 1)
    setInputFields(newData)
  }

  const readExcel = (file) => {
    setNewItems(true)
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      fileReader.readAsArrayBuffer(file)

      fileReader.onload = (e) => {
        const bufferArray = e.target.result

        const wb = XLSX.read(bufferArray, { type: 'buffer' })

        const wsname = wb.SheetNames[0]

        const ws = wb.Sheets[wsname]

        const data = XLSX.utils.sheet_to_json(ws)
        console.log(data)
        resolve(data)
      }

      fileReader.onerror = (error) => {
        reject(error)
      }
    })

    promise.then((d) => {
      setItems(d)
    })
  }

  let confirmingExcelInput = (e) => {
    e.preventDefault()

    let type = e.target.parentNode.parentNode.cells[1].innerText
    let question = e.target.parentNode.parentNode.cells[2].innerText
    let answer = e.target.parentNode.parentNode.cells[3].innerText
    let options = e.target.parentNode.parentNode.cells[4].innerText

    if (question === '' || options === '' || answer === '' || type === '') {
      setShow3(true)
      setMessage('Missing Fields')
    } else {
      console.log('Success')
      axios
        .post('localhost:5678/request/' + course, {
          question: question,
          type: type,
          options: options,
          answer: answer,
        })
        .then(function () {
          // handle success
          setAnswer('')
          setType('pick one')
          setQuestion('')
          setOptions('')
          setInputFields([{ options: '', answer: '' }])
          setCreate(null)
          refreshPage()
        })
        .catch(function (error) {
          // handle error
          if (error.response.status === 400) {
            console.log(error)
            setError('Cant find record')
          } else {
            setError('Unexpected Error')
          }
        })
        .then(function () {
          // always executed
        })
    }


    setItems(items)
    if (items.length == 0) {
      setNewItems(false)
    }
  }

  useEffect(() => {
    determineAccess()
    getFormData()
  }, [])

  return (
    <>
      {isOwner === "true" && (
        <>
          <div>
            <h3 className="otext text-center font-weight-bold text-uppercase">
              Choose a Module to Edit or Add More Questions
            </h3>

            <div className="input-group">
              <Col>
                <label className="createmod">Create Module</label>
                <form className="createg" onSubmit={createModules}>
                  <input
                    type="text"
                    className="input3"
                    id="collectionName"
                    name="collectionName"
                    value={collectionName}
                    onChange={(e) => {
                      setCollectionName(e.target.value);
                    }}
                  />
                  <button className="addmod">
                    <i className="bi-plus"></i>
                    {"Add Module"}
                  </button>
                </form>
              </Col>

              <Col>
                <Dropdown className="d-flex justify-content-end">
                  <Dropdown.Toggle className="select">
                    Select a Module
                  </Dropdown.Toggle>
                  {module && (!module.length || module.length === 0) && (
                    <p>No results found</p>
                  )}
                  {module && module.length > 0 && (
                    <>
                      <Dropdown.Menu className="dropmenu">
                        {module.map((myCourse) => {
                          return (
                            <div key={myCourse}>
                              <Dropdown.Item
                                className="items2"
                                onClick={getQuestion}
                              >
                                {myCourse}
                              </Dropdown.Item>
                            </div>
                          );
                        })}
                      </Dropdown.Menu>
                    </>
                  )}
                </Dropdown>
              </Col>

              {data && (
                <>
                  <div>
                    <Col>
                      <button className="createq" onClick={onClick}>
                        <i className="bi-plus"></i>
                        Create Question
                      </button>
                    </Col>
                    <Modal show={show} onHide={handleClose}>
                      <Modal.Header closeButton>
                        <Modal.Title>Create a question</Modal.Title>
                      </Modal.Header>
                      {create && (
                        <>
                          <Modal.Body>
                            <form onSubmit={createQuestion}>
                              <label htmlFor="question">Question</label>
                              <input
                                type="text"
                                id="question"
                                name="question"
                                value={question}
                                onChange={(e) => {
                                  setQuestion(e.target.value);
                                }}
                              />

                              <label htmlFor="type">Type</label>
                              <select
                                value={type}
                                onChange={(e) => {
                                  setType(e.target.value);
                                }}
                              >
                                <option value="pick one">pick one</option>
                                <option value="multichoice">multichoice</option>
                                <option value="matching">matching</option>
                              </select>
                              <p></p>
                              {type === "pick one" && (
                                <>
                                  <div>
                                    <label htmlFor="options">
                                      Options: Seperate with ,
                                    </label>
                                    <input
                                      type="text"
                                      id="options"
                                      name="options"
                                      value={options}
                                      onChange={(e) => {
                                        setOptions(e.target.value);
                                      }}
                                    />

                                    <label htmlFor="answer">Answer:</label>
                                    <input
                                      type="text"
                                      id="answer"
                                      name="answer"
                                      value={answer}
                                      onChange={(e) => {
                                        setAnswer(e.target.value);
                                      }}
                                    />
                                  </div>
                                </>
                              )}
                              {type === "multichoice" && (
                                <>
                                  <div>
                                    <form onSubmit={createQuestion}>
                                      {inputFields.map((form, index) => {
                                        return (
                                          <div key={index}>
                                            <input
                                              name="options"
                                              placeholder={index}
                                              onChange={(event) =>
                                                handleFormChange2(event, index)
                                              }
                                              value={form.options.toString()}
                                            />

                                            <input
                                              type="checkbox"
                                              id="checking"
                                              name="answer"
                                              placeholder={index}
                                              onChange={(event) =>
                                                handleFormChange2(event, index)
                                              }
                                              value={form.answer.toString()}
                                            />

                                            <button
                                              className="remove"
                                              onClick={() =>
                                                removeFields(index)
                                              }
                                            >
                                              Remove
                                            </button>
                                          </div>
                                        );
                                      })}
                                    </form>
                                    <button
                                      className="addmore"
                                      onClick={addFields}
                                    >
                                      Add More..
                                    </button>
                                  </div>
                                </>
                              )}
                              {type === "matching" && (
                                <>
                                  <div>
                                    <form onSubmit={createQuestion}>
                                      {inputFields.map((form, index) => {
                                        return (
                                          <div key={index}>
                                            <input
                                              name="options"
                                              placeholder={index}
                                              onChange={(event) =>
                                                handleFormChange(event, index)
                                              }
                                              value={form.options.toString()}
                                            />
                                            <input
                                              name="answer"
                                              placeholder={index}
                                              onChange={(event) =>
                                                handleFormChange(event, index)
                                              }
                                            />
                                            <button
                                              className="remove"
                                              onClick={() =>
                                                removeFields(index)
                                              }
                                            >
                                              Remove
                                            </button>
                                          </div>
                                        );
                                      })}
                                    </form>

                                    <button
                                      className="addmore"
                                      onClick={addFields}
                                    >
                                      Add More..
                                    </button>
                                    <br />
                                  </div>
                                </>
                              )}

                              <br />
                              <Modal.Footer>
                                <Button
                                  variant="secondary"
                                  onClick={handleClose}
                                >
                                  Close
                                </Button>
                                <button
                                  className="addquest"
                                  onClick={handleClose}
                                >
                                  {"Add question"}
                                </button>
                              </Modal.Footer>
                            </form>
                          </Modal.Body>
                        </>
                      )}
                    </Modal>
                  </div>
                  <div className="tablewrap table-responsive">
                    {" "}
                    <p className="otitle">{course}</p>
                    <table className="table2 table">
                      <thead className="thead">
                        <tr>
                          <th>Record ID</th>
                          <th>Type</th>
                          <th>Question</th>
                          <th>Answer</th>
                          <th>Options</th>
                          <th>Edit</th>
                          <th>Delete</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.map((student) => {
                          return (
                            <tr key={student._id}>
                              <td>{student._id}</td>
                              <td>{student.type}</td>
                              <td>{student.question}</td>
                              <td>{student.answer.toString().split(" ")}</td>
                              <td className="fixedw">
                                {student.options.toString().split(" ")}
                              </td>
                              <td>
                                <button
                                  onClick={onClick2}
                                  className="edit bi-pencil-square bg-success"
                                >
                                  Edit
                                </button>
                              </td>
                              <td>
                                <button
                                  className="edit bi-trash bg-danger"
                                  onClick={deleteQuestion}
                                  value={student._id}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>{" "}
                    <button
                      className="deletem bg-danger"
                      onClick={deleteModulesAppear}
                    >
                      Delete Module
                    </button>
                  </div>
                  <div class="col">
                    <input
                      type="file"
                      class="oinput custom-file-input"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        readExcel(file);
                      }}
                    />
                  </div>
                  {newItems && items && (
                    <>
                      <table className="table container">
                        <thead>
                          <tr>
                            <th></th>
                            <th scope="col">Type</th>
                            <th scope="col">Question</th>
                            <th scope="col">Answer</th>
                            <th scope="col">Options</th>
                            <th> </th>
                          </tr>
                        </thead>

                        <tbody>
                          {items.map((d, counter) => {
                            counter += 1;
                            return (
                              <tr key={d.question}>
                                <td>{counter}</td>
                                <td>{d.type}</td>
                                <th>{d.question}</th>
                                <th>{d.answer}</th>
                                <td>{d.options}</td>

                                <td>
                                  <button
                                    onClick={confirmingExcelInput}
                                    className="edit bg-success"
                                  >
                                    Confirm
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </>
                  )}
                  <div className="deletemod row">
                    {confirmDelete && (
                      <>
                        <div>
                          <form onSubmit={confirmingDeletion}>
                            <label className="createmod">
                              Type "{course}" to confirm deletion:
                            </label>
                            <input
                              value={deleting}
                              onChange={(e) => {
                                setDeleting(e.target.value);
                              }}
                            />
                            <button className="confirm">Confirm</button>
                            {isDeleted && <p>{isDeleted}</p>}
                          </form>
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}
              <Modal show={show2} onHide={handleClose2}>
                <Modal.Header closeButton>
                  <Modal.Title>Edit question</Modal.Title>
                </Modal.Header>
                {edit && (
                  <>
                    <Modal.Body>
                      <form onSubmit={editQuestion}>
                        <label>Question:</label>
                        <input
                          type="text"
                          className="input2"
                          id="question"
                          name="question"
                          value={question}
                          onChange={(e) => {
                            setQuestion(e.target.value);
                          }}
                        />
                        <label>Type:</label>
                        <select
                          value={type}
                          onChange={(e) => {
                            setType(e.target.value);
                          }}
                        >
                          <option value="pick one">pick one</option>
                          <option value="multichoice">multichoice</option>
                          <option value="matching">matching</option>
                        </select>
                        <p></p>

                        {type === "pick one" && (
                          <>
                            <div>
                              <label htmlFor="options">Options</label>
                              <input
                                type="text"
                                id="options"
                                name="options"
                                value={options}
                                onChange={(e) => {
                                  setOptions(e.target.value);
                                }}
                              />

                              <label htmlFor="answer">Answer</label>
                              <input
                                type="text"
                                id="answer"
                                name="answer"
                                value={answer}
                                onChange={(e) => {
                                  setAnswer(e.target.value);
                                }}
                              />
                            </div>
                          </>
                        )}
                        {type === "multichoice" && (
                          <>
                            <div>
                              <form onSubmit={createQuestion}>
                                {inputFields.map((form, index) => {
                                  return (
                                    <div key={index}>
                                      <input
                                        name="options"
                                        placeholder={index}
                                        onChange={(event) =>
                                          handleFormChange2(event, index)
                                        }
                                        value={form.options}
                                      />
                                      <input
                                        type="checkbox"
                                        id="checking"
                                        name="answer"
                                        placeholder={index}
                                        onChange={(event) =>
                                          handleFormChange2(event, index)
                                        }
                                        value={form.answer}
                                      />
                                      <button
                                        className="remove"
                                        onClick={() => removeFields(index)}
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  );
                                })}
                              </form>
                              <button className="addmore" onClick={addFields}>
                                Add More..
                              </button>
                            </div>
                          </>
                        )}
                        {type === "matching" && (
                          <>
                            <div>
                              <form onSubmit={createQuestion}>
                                {inputFields.map((form, index) => {
                                  return (
                                    <div key={index}>
                                      <input
                                        name="options"
                                        placeholder={form.options}
                                        onChange={(event) =>
                                          handleFormChange(event, index)
                                        }
                                        value={form.options}
                                      />
                                      <input
                                        name="answer"
                                        placeholder={form.answer}
                                        onChange={(event) =>
                                          handleFormChange(event, index)
                                        }
                                        value={form.answer}
                                      />
                                      <button
                                        className="remove"
                                        onClick={() => removeFields(index)}
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  );
                                })}
                              </form>

                              <button className="addmore" onClick={addFields}>
                                Add More..
                              </button>
                              <br />
                            </div>
                          </>
                        )}

                        <br />
                        <Modal.Footer>
                          <Button variant="secondary" onClick={handleClose2}>
                            Close
                          </Button>
                          <button className="addquest" onClick={handleClose2}>
                            {"Edit question"}
                          </button>
                        </Modal.Footer>
                      </form>
                    </Modal.Body>
                  </>
                )}
              </Modal>
            </div>
          </div>
          <Loader type="pacman" />
        </>
      )}
      {message && message.length > 0 && (
        <ToastContainer className="position-absolute bottom-0 end-0 p-3">
          <Toast
            onClose={() => setShow3(false)}
            show3={show3}
            delay={100}
            autohide
          >
            <Toast.Body>{message}</Toast.Body>
          </Toast>
        </ToastContainer>
      )}
      {isOwner === "false" && (
        <>
          <p className="completed">You are not authorized to use this page</p>
        </>
      )}
    </>
  );
}

export default Content
