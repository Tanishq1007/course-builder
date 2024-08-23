import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FaPlus } from 'react-icons/fa';
import Module from './Module';

const CourseBuilder = () => {
  const [modules, setModules] = useState([]);

  const addModule = () => {
    const newModule = { id: Date.now(), name: 'New Module', resources: [] };
    setModules([...modules, newModule]);
  };

  const addResource = (moduleId, resource) => {
    const updatedModules = modules.map(module =>
      module.id === moduleId
        ? { ...module, resources: [...module.resources, resource] }
        : module
    );
    setModules(updatedModules);
  };

  const updateModuleName = (moduleId, newName) => {
    const updatedModules = modules.map(module =>
      module.id === moduleId
        ? { ...module, name: newName }
        : module
    );
    setModules(updatedModules);
  };

  const updateResource = (moduleId, resourceId, updatedResource) => {
    const updatedModules = modules.map(module => {
      if (module.id === moduleId) {
        const updatedResources = module.resources.map(resource =>
          resource.id === resourceId
            ? { ...resource, ...updatedResource }
            : resource
        );
        return { ...module, resources: updatedResources };
      }
      return module;
    });
    setModules(updatedModules);
  };

  const deleteModule = moduleId => {
    const updatedModules = modules.filter(module => module.id !== moduleId);
    setModules(updatedModules);
  };

  const deleteResource = (moduleId, resourceId) => {
    const updatedModules = modules.map(module => {
      if (module.id === moduleId) {
        const updatedResources = module.resources.filter(resource => resource.id !== resourceId);
        return { ...module, resources: updatedResources };
      }
      return module;
    });
    setModules(updatedModules);
  };
  const moveResource = (sourceModuleId, destinationModuleId, dragIndex, hoverIndex = null) => {
    let sourceModule = modules.find(module => module.id === sourceModuleId);
    let destinationModule = modules.find(module => module.id === destinationModuleId);

    const draggedResource = sourceModule.resources[dragIndex];
    if (sourceModuleId === destinationModuleId) {
      const updatedResources = [...sourceModule.resources];
      updatedResources.splice(dragIndex, 1);
      updatedResources.splice(hoverIndex, 0, draggedResource);
      sourceModule = { ...sourceModule, resources: updatedResources };
      setModules(modules.map(module => (module.id === sourceModuleId ? sourceModule : module)));
    } else {
      sourceModule = { ...sourceModule, resources: sourceModule.resources.filter((_, idx) => idx !== dragIndex) };
      destinationModule = { ...destinationModule, resources: [...destinationModule.resources, draggedResource] };
      setModules(modules.map(module => (module.id === sourceModuleId ? sourceModule : module.id === destinationModuleId ? destinationModule : module)));
    }
  };

  const moveModule = (dragIndex, hoverIndex) => {
    const draggedModule = modules[dragIndex];
    const updatedModules = [...modules];
    updatedModules.splice(dragIndex, 1);
    updatedModules.splice(hoverIndex, 0, draggedModule);
    setModules(updatedModules);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <button onClick={addModule}>
          <FaPlus /> Add Module
        </button>
        {modules.map((module, index) => (
          <ModuleDraggable
            key={module.id}
            module={module}
            index={index}
            moveModule={moveModule}
            updateModuleName={updateModuleName}
            addResource={addResource}
            updateResource={updateResource}
            deleteModule={deleteModule}
            deleteResource={deleteResource}
            moveResource={moveResource}
          />
        ))}
      </div>
    </DndProvider>
  );
};

const ModuleDraggable = ({ module, index, moveModule, ...props }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'MODULE',
    item: { index },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'MODULE',
    hover(item, monitor) {
      if (!drag) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      moveModule(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  return (
    <div ref={node => drag(drop(node))} style={{ opacity: isDragging ? 0.5 : 1, cursor: 'move' }}>
      <Module {...props} module={module} />
    </div>
  );
};

export default CourseBuilder;
