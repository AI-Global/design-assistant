import { Modal, Button} from 'react-bootstrap';
import React, { Component } from 'react';

export default class EditModal extends Component {
    constructor(props){
        super(props);
        this.state = {
            showEditModal: false
        }
    }

    render(){
        const showEdit = this.state.showEditModal;
        const handleEditClose = () => this.setState({showEditModal: false});
        const handleEditShow = () => this.setState({showEditModal: true});
        return (
            <div>
                <Button onClick={() => {handleEditShow()}}>Edit</Button>
                <Modal show={showEdit}
                onHide={handleEditClose}
                backdrop="static"
                keyboard={false}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            User Registration
                        </Modal.Title>
                        <Modal.Body>
                            test
                        </Modal.Body>
                    </Modal.Header>                
                    
                </Modal>
            </div>
        )
    }
}