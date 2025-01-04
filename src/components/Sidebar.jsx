import React, { useState } from 'react';
import PropTypes from 'prop-types';


const Sidebar = ({ position, children }) => {
  const [collapsed, setCollapsed] = useState(true);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className={`sidebar ${position} ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-content rounded-rect flex-center">
        {children}
        <div
          className={`sidebar-toggle rounded-rect ${position}`}
          onClick={toggleSidebar}
        >
          {position === 'left' ? (collapsed ? '→' : '←') : (collapsed ? '←' : '→')}
        </div>
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  position: PropTypes.oneOf(['left', 'right']).isRequired,
  children: PropTypes.node.isRequired,
};

export default Sidebar;
