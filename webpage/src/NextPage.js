
import React from 'react';
import Sidebar from './Sidebarhorizontal';
import Table from './Table';

function NextPage() {
  return (
    <div className="page-container">
      <div className="sidebar-section">
        <Sidebar />
      </div>
      <div className="content-section">
        <h1>Content Section</h1>
        <Table />
      </div>
    </div>
  );
}

export default NextPage;

