import React, { useState } from 'react';
import Resource from './Resource';
import { FaTrash, FaEdit, FaPlus } from 'react-icons/fa';
import { useDrop } from 'react-dnd';
import { ItemTypes } from './ItemTypes';

const Module = ({ module, updateModuleName, addResource, updateResource, deleteModule, deleteResource, moveResource }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [moduleName, setModuleName] = useState(module.name);
  const [resourceUrl, setResourceUrl] = useState('');

  const handleModuleNameChange = (e) => {
    setModuleName(e.target.value);
  };

  const handleModuleNameSave = () => {
    updateModuleName(module.id, moduleName);
    setIsEditing(false);
  };

  const handleAddResource = () => {
    const newResource = { 
      id: Date.now(), 
      type: 'link',
      name: 'New Link',
      url: resourceUrl // Use the entered URL here
    };
    addResource(module.id, newResource);
    setResourceUrl(''); // Clear the URL input after adding the resource
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newResource = {
        id: Date.now(),
        type: 'file',
        name: file.name,
        file: URL.createObjectURL(file)
      };
      addResource(module.id, newResource);
    }
  };

  const handleUrlChange = (e) => {
    setResourceUrl(e.target.value);
  };

  const [, drop] = useDrop({
    accept: ItemTypes.RESOURCE,
    hover: (item, monitor) => {
      if (item.moduleId !== module.id) {
        moveResource(item.moduleId, module.id, item.index);
        item.moduleId = module.id;
        item.index = module.resources.length;
      }
    },
  });

  return (
    <div className="module" ref={drop}>
      <div className="module-header">
        {isEditing ? (
          <input 
            type="text" 
            value={moduleName} 
            onChange={handleModuleNameChange} 
            onBlur={handleModuleNameSave} 
            autoFocus 
          />
        ) : (
          <h3 onClick={() => setIsEditing(true)}>
            {module.name} <FaEdit />
          </h3>
        )}
        <FaTrash onClick={() => deleteModule(module.id)} />
      </div>
      <div className="module-resources">
        {module.resources.map((resource, index) => (
          <Resource
            key={resource.id}
            resource={resource}
            moduleId={module.id}
            index={index}
            moveResource={moveResource}
            updateResource={updateResource}
            deleteResource={deleteResource}
          />
        ))}
      </div>
      <div>
        <input 
          type="text" 
          value={resourceUrl} 
          onChange={handleUrlChange} 
          placeholder="Enter URL" 
        />
        <button onClick={handleAddResource}>
          <FaPlus /> Add Link
        </button>
      </div>
      <input type="file" onChange={handleFileUpload} />
    </div>
  );
};

export default Module;