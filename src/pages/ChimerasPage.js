import React from 'react';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

function ChimerasPage() {
    return (
    <div>
        <table>
            <thead>
                <tr>
                    <th>Mitochondrial Gene</th>
                    <th>Vector Used</th>
                    <th>Provider Name</th>
                    <th>Disease/Phenotype</th>
                </tr>
            </thead>
            <tbody>
                {/* fill with data */}
            </tbody>
        </table>
    </div>
);
}

export default ChimerasPage;