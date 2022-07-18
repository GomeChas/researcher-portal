import React from 'react';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

function ResearchersPage() {
    return (
    <div>
        <table>
            <thead>
                <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Active Credential</th>
                </tr>
            </thead>
            <tbody>
                {/* fill with data */}
            </tbody>
        </table>
    </div>
);
}

export default ResearchersPage;