import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import ListsToDo from "./ListToDo";
import Form from "react-bootstrap/Form";

class Todo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            input : '',
            current : {},
            key: 0,
        };
        this.inputRef = React.createRef();
        this.handleChange = this.handleChange.bind(this);
        this.handleAddClick = this.handleAddClick.bind(this);
        this.handleEnterPressed = this.handleEnterPressed.bind(this);
    }

    componentDidMount() {
        this.inputRef.current.focus();
    }

    handleChange(e) {
        this.setState({
            input : e.target.value,
        })
    }

    handleAddClick(e) {
        if (this.inputRef.current.value.trim()) {
            this.setState({
                current : { value : this.inputRef.current.value, key : this.state.key, isChecked: false, isEditing : false},
                input : '',
                key: this.state.key + 1,
            });
            this.inputRef.current.focus();
        }
        this.inputRef.current.value = '';
        e.preventDefault();
    }

    handleEnterPressed(e){
        if (e.keyCode === 13) {
            this.handleAddClick(e);
        }
    }

    render() {
        const {input, current} = this.state;
        return(
            <div>
                <h1 className ={'text-center bg-light'}>To Do List</h1>
                <Form>
                    <InputGroup size={"lg"} className="container mt-3 mb-3">
                        <FormControl
                            placeholder="What to do?"
                            onKeyDown={this.handleEnterPressed}
                            ref={this.inputRef}
                        />
                        <InputGroup.Append>
                            <Button
                                type='submit'
                                variant={"success"}
                                onClick={this.handleAddClick}>Add</Button>
                        </InputGroup.Append>
                    </InputGroup>
                </Form>
                <ListsToDo addedToDo={current}
                />
            </div>

        )
    }
}

export default Todo;