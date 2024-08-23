import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { ItemTypes } from './ItemTypes';
import { FaTrash, FaEdit, FaGripVertical } from 'react-icons/fa';

const Resource = ({ resource, moduleId, index, moveResource, updateResource, deleteResource }) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingUrl, setIsEditingUrl] = useState(false);
  const [resourceName, setResourceName] = useState(resource.name);
  const [resourceUrl, setResourceUrl] = useState(resource.url || '');

  const handleResourceNameChange = (e) => {
    setResourceName(e.target.value);
  };

  const handleResourceUrlChange = (e) => {
    setResourceUrl(e.target.value);
  };

  const handleResourceSave = () => {
    updateResource(moduleId, resource.id, { name: resourceName, url: resourceUrl });
    setIsEditingName(false);
    setIsEditingUrl(false);
  };

  const handleEditNameClick = () => {
    setIsEditingName(true);
  };

  const handleEditUrlClick = () => {
    setIsEditingUrl(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleResourceSave();
    }
  };

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.RESOURCE,
    item: { type: ItemTypes.RESOURCE, id: resource.id, index, moduleId },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const resourceStyle = {
    border: '1px solid #ccc',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px',
  };

  const resourceHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
  };

  const resourceNameStyle = {
    margin: '0',
    flexGrow: '1',
    textAlign: 'center',
  };

  const editButtonStyle = {
    marginRight: '5px',
    cursor: 'pointer',
  };

  const deleteButtonStyle = {
    cursor: 'pointer',
  };

  const inputStyle = {
    marginBottom: '5px',
    width: '100%',
  };

  return (
    <div 
      ref={drag} 
      style={{ ...resourceStyle, opacity: isDragging ? 0.5 : 1 }} 
    >
      <div style={resourceHeaderStyle}>
        <FaGripVertical style={{ marginRight: '5px' }} />
        {isEditingName ? (
          <input 
            type="text" 
            value={resourceName} 
            onChange={handleResourceNameChange} 
            onBlur={handleResourceSave} 
            autoFocus 
            style={{ ...inputStyle, flexGrow: '1' }} 
          />
        ) : (
          <h4 style={resourceNameStyle}>{resource.name}</h4>
        )}
        <div>
          <FaEdit style={editButtonStyle} onClick={handleEditNameClick} />
          <FaTrash style={deleteButtonStyle} onClick={() => deleteResource(moduleId, resource.id)} />
        </div>
      </div>
      <div className="resource-info">
        {isEditingUrl ? (
          <input 
            type="text" 
            value={resourceUrl} 
            onChange={handleResourceUrlChange} 
            onBlur={handleResourceSave} 
            onKeyDown={handleKeyDown} // Add keydown event handler
            style={inputStyle} 
          />
        ) : (
          <div>
            {resource.type === 'file' && (
              <div>
                <a href={resource.file} download>{resource.name}</a>
              </div>
            )}
            {resource.type === 'link' && (
              <div>
                <a href={resource.url} target="_blank" rel="noopener noreferrer">{resource.url}</a>
                <FaEdit style={editButtonStyle} onClick={handleEditUrlClick} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Resource;
