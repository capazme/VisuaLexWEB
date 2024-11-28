// src/utils/parsePosition.js

/**
 * Converte una stringa di posizione in una struttura gerarchica.
 * @param {string} position - La stringa di posizione, divisa da '>'.
 * @returns {Array} - Un array di oggetti gerarchici.
 */
export const parsePosition = (position) => {
    if (!position) return [];
  
    // Utilizza una regex per dividere per '>' con possibili spazi e simboli extra
    const sections = position.split(/(?:\s*-\s*)?>/).map(section => section.trim());
  
    const tree = [];
    let currentLevel = tree;
  
    sections.forEach((section, index) => {
      if (!section) return; // Salta sezioni vuote
  
      let existingNode = currentLevel.find(node => node.title === section);
      if (!existingNode) {
        existingNode = {
          title: section,
          key: `${section}-${index}-${Math.random()}`, // Chiave unica
          children: [],
        };
        currentLevel.push(existingNode);
      }
      currentLevel = existingNode.children;
    });
  
    return tree;
  };
  