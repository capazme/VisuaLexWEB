// src/components/FloatingBalls/ExpandibleTree/ExpandbleTree.js
import React from 'react';
import { Tree } from 'antd';

const ExpandbleTree = ({ norm, onSelectArticle }) => {
  const renderTreeNodes = () =>
    norm.brocardi_info.Massime.map((article, index) => (
      <Tree.TreeNode title={`Articolo ${index + 1}`} key={index} onClick={() => onSelectArticle(article)} />
    ));

  return (
    <Tree>
      {renderTreeNodes()}
    </Tree>
  );
};

export default ExpandbleTree;
