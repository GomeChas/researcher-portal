import React from 'react';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

function HomePage() {
    return (
    <div>
        <table>
            <thead>
                <tr>
                    <th>Project Staff</th>
                    <th>Creation Date</th>
                    <th>Transfection Complete</th>
                    <th>Completion Date</th>
                    <th>Storage Freezer</th>
                    <th>Freezer Box Location</th>
                </tr>
            </thead>
            <tbody>
                {/* fill with data */}
            </tbody>
        </table>
    </div>
);
}

export default HomePage;