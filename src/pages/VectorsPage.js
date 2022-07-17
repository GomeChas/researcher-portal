import React from 'react';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

function VectorsPage() {
    return (
    <div>
        <table>
            <thead>
                <tr>
                    <th>Product Name</th>
                    <th>AntiBacterial Selection</th>
                    <th>Vector Size</th>
                    <th>Restriction Enzymes</th>
                </tr>
            </thead>
            <tbody>
                {/* fill with data */}
            </tbody>
        </table>
    </div>
);
}

export default VectorsPage;