import React from "react";
import ListGroup from "react-bootstrap/ListGroup";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import PropTypes from 'prop-types';
import Toast from 'react-bootstrap/Toast';
import './Todo.css';

class ListsToDo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listOfToDos : [],
            currentEditingValue : '',
            currentlyEditing: false,
            showToast: false,
        };
        this.listElRef = React.createRef();
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        // console.log(nextProps.addedToDo, 'p');
        // console.log(prevState.listOfToDos, 's');
        let prevKey = prevState.listOfToDos.length ? prevState.listOfToDos[prevState.listOfToDos.length - 1].key : undefined;
        if (nextProps.addedToDo.key !== prevKey) {
            return {
                listOfToDos: prevState.listOfToDos.concat(nextProps.addedToDo)
            }
        } else {return null;}
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    // static getDerivedStateFromProps(props, state) {
    //     // console.log(this.props);
    //     // if (this.props.addedToDo.key) {
    //     //         this.setState({
    //     //         listOfToDos: this.state.listOfToDos.concat(this.props.addedToDo),
    //     //     })
    //     // }
    //     console.log(props);
    //     return {
    //         listOfToDos: state.listOfToDos.concat(props.addedToDo),
    //     };
    // }

    handleListItemClick = (listEl) => {
        if (!listEl.isEditing) {
            this.checkedElement(listEl.key);
        }
    };

    checkedElement(key) {
        let {listOfToDos} = this.state;
        let currentEl = listOfToDos.find(el => el.key === key);
        currentEl.isChecked = !currentEl.isChecked;
        let indexOfCurr = listOfToDos.indexOf(currentEl);
        listOfToDos[indexOfCurr] = currentEl;
        this.setState({
            listOfToDos : listOfToDos,
        });
    }

    handleEditFormChange = (listEl, e) => {
        this.setState({
            currentEditingValue : e.target.value,
        });
    };

    handleEditClick = (listEl, e) => {
        if (!this.state.currentlyEditing || e.target.innerHTML === 'Save') {
            let {currentlyEditing} = this.state;
            this.setState({
                currentEditingValue: listEl.value,
                currentlyEditing: !currentlyEditing,
            });
            this.editItem(listEl.key);
            // console.log(this.listElRef.current);
            // this.listElRef.current.focus();
        } else {
            this.setState({showToast : true})
        }
        e.stopPropagation();
    };

    editItem(key) {
        let {listOfToDos} = this.state;
        let currentEl = listOfToDos.find(el => el.key === key);
        currentEl.isEditing = true;
        let indexOfCurr = listOfToDos.indexOf(currentEl);
        listOfToDos[indexOfCurr] = currentEl;
        this.setState({
            listOfToDos : listOfToDos,
        });
    }

    handleSaveClick = (key, e) => {
        let {listOfToDos, currentEditingValue} = this.state;
        let currentEl = listOfToDos.find(el => el.key === key);
        currentEl.value = currentEditingValue;
        currentEl.isEditing = false;
        let indexOfCurr = listOfToDos.indexOf(currentEl);
        listOfToDos[indexOfCurr] = currentEl;
        this.setState({
            listOfToDos : listOfToDos,
            currentlyEditing: false,
        });
        e.stopPropagation();
    };

    handleCancelClick = (key, e) => {
        let {listOfToDos} = this.state;
        let currentEl = listOfToDos.find(el => el.key === key);
        currentEl.isEditing = false;
        let indexOfCurr = listOfToDos.indexOf(currentEl);
        listOfToDos[indexOfCurr] = currentEl;
        this.setState({
            listOfToDos : listOfToDos,
            currentlyEditing: false,
        });
        e.stopPropagation();
    };

    handleDeleteClick = (key, e) => {
        this.deleteItem(key);
        e.stopPropagation();
    };

    deleteItem(key) {
        let {listOfToDos} = this.state;
        let newList = listOfToDos.filter((el) => el.key !== key);
        console.log(newList, 'n')
        this.setState({
            listOfToDos: newList,
        })
    }

    handleEnterPressed(key, e){
        if (e.keyCode === 13) {
            this.handleSaveClick(key, e);
        }
    }

    renderListEl(listEl){
        const {currentlyEditing, currentlyEditingValue} = this.state;
        return (
            <InputGroup key={listEl.key} className="container" onClick={(event) => this.handleListItemClick(listEl, event)}>
                <InputGroup.Prepend>
                    <InputGroup.Checkbox readOnly={true} checked={listEl.isChecked}/>
                </InputGroup.Prepend>
                <FormControl
                    style={{
                        textDecoration: listEl.isChecked ? 'line-through' : 'none'
                    }}
                    ref={this.listElRef}
                    disabled={!listEl.isEditing}
                    value={currentlyEditing ? currentlyEditingValue : listEl.value}
                    onKeyDown={(event) => this.handleEnterPressed(listEl.key, event)}
                    onChange={(event) => this.handleEditFormChange(listEl, event)}/>
                {
                    listEl.isEditing ?
                        <>
                            <InputGroup.Append>
                                <Button
                                    variant={"info"}
                                    onClick={(event) => this.handleSaveClick(listEl.key, event)}>Save</Button>
                                <Button
                                    variant={"secondary"}
                                    onClick={(event) => this.handleCancelClick(listEl.key, event)}>Cancel</Button>
                            </InputGroup.Append>
                        </>
                    :
                        <>
                            <InputGroup.Append>
                                <Button
                                    variant={"outline-warning"}
                                    onClick={(event) => this.handleEditClick(listEl, event)}>Edit</Button>
                                <Button
                                    variant={"outline-danger"}
                                    onClick={(event) => this.handleDeleteClick(listEl.key, event)}>Delete</Button>
                            </InputGroup.Append>
                        </>
                }
            </InputGroup>);
    };

    render() {
        const {listOfToDos, showToast} = this.state;

        return (
            <>
                <ListGroup className="container">
                    {console.log(listOfToDos)}
                    {listOfToDos.map(listEl => this.renderListEl(listEl))}
                </ListGroup>
                <Toast onClose={() => this.setState({showToast : false})} show={showToast} delay={2000} autohide
                       style={{

                       }}>
                    <Toast.Header>
                        <strong className="mr-auto">Warning!</strong>
                    </Toast.Header>
                    <Toast.Body>Please Save/Cancel active line first</Toast.Body>
                </Toast>
            </>
        );
    }
}

ListsToDo.propTypes = {
    addedToDo: PropTypes.object,
};

export default ListsToDo;