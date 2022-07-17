import React from 'react';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

function GenesPage() {
    return (
    <div>
        <table>
            <thead>
                <tr>
                    <th>HGNC Symbol</th>
                    <th>HGNC ID</th>
                    <th>HGNC Name</th>
                    <th>NCBI ID</th>
                    <th>UniProt ID</th>
                </tr>
            </thead>
            <tbody>
                {/* fill with data */}
            </tbody>
        </table>
    </div>
);
}

export default GenesPage;