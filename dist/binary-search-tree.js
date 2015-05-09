/*!
 * js-data-structures
 * http://github.com/Tyriar/js-data-structures
 *
 * Copyright 2015 Daniel Imms
 * Released under the MIT license
 * http://github.com/Tyriar/js-data-structures/blob/master/LICENSE
 */
(function (root, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define([], function () {
      return (root.BinarySearchTree = factory());
    });
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.BinarySearchTree = factory();
  }
}(this, function () {
  'use strict';

  var BinarySearchTree = function (customCompare) {
    this.root = undefined;
    this.nodeCount = 0;

    if (customCompare) {
      this.compare = customCompare;
    }
  };

  BinarySearchTree.prototype.add = function (key) {
    var newNode = new Node(key);

    if (!this.root) {
      this.nodeCount++;
      this.root = newNode;
      return true;
    }

    var current = this.root;
    while (true) {
      if (this.compare(key, current.key) < 0) {
        if (!current.left) {
          current.left = newNode;
          this.nodeCount++;
          return true;
        }
        current = current.left;
      } else if (this.compare(key, current.key) > 0) {
        if (!current.right) {
          current.right = newNode;
          this.nodeCount++;
          return true;
        }
        current = current.right;
      } else {
        return false;
      }
    }
  };

  BinarySearchTree.prototype.contains = function (key) {
    if (!this.root) {
      return false;
    }

    var current = this.root;
    while (true) {
      if (this.compare(key, current.key) < 0) {
        if (!current.left) {
          return false;
        }
        current = current.left;
      } else if (this.compare(key, current.key) > 0) {
        if (!current.right) {
          return false;
        }
        current = current.right;
      } else {
        return true;
      }
    }
  };

  BinarySearchTree.prototype.findMaximum = function () {
    if (!this.root) {
      return undefined;
    }

    var current = this.root;
    while (true) {
      if (current.right) {
        current = current.right;
      } else {
        return current.key;
      }
    }
  };

  BinarySearchTree.prototype.findMinimum = function () {
    if (!this.root) {
      return undefined;
    }

    var current = this.root;
    while (true) {
      if (current.left) {
        current = current.left;
      } else {
        return current.key;
      }
    }
  };

  BinarySearchTree.prototype.isEmpty = function () {
    return !this.root;
  };

  BinarySearchTree.prototype.remove = function (key) {
    if (!this.root) {
      return false;
    }

    var parent;
    var current = this.root;
    while (true) {
      if (this.compare(key, current.key) < 0) {
        if (!current.left) {
          return false;
        }
        parent = current;
        current = current.left;
      } else if (this.compare(key, current.key) > 0) {
        if (!current.right) {
          return false;
        }
        parent = current;
        current = current.right;
      } else {
        this.nodeCount--;
        deleteNode(current, parent, this);
        return true;
      }
    }
  };

  BinarySearchTree.prototype.size = function () {
    return this.nodeCount;
  };

  BinarySearchTree.prototype.traversePreOrder = function (visit) {
    if (!this.root) {
      return;
    }

    var parentStack = [];
    parentStack.push(this.root);
    do {
      var top = parentStack.pop();
      visit(top.key);
      if (top.right) {
        parentStack.push(top.right);
      }
      if (top.left) {
        parentStack.push(top.left);
      }
    } while (parentStack.length);
  };

  BinarySearchTree.prototype.traverseInOrder = function (visit) {
    var parentStack = [];
    var node = this.root;
    while (parentStack.length || node) {
      if (node) {
        parentStack.push(node);
        node = node.left;
      } else {
        node = parentStack.pop();
        visit(node.key);
        node = node.right;
      }
    }
  };

  BinarySearchTree.prototype.traversePostOrder = function (visit) {
    var parentStack = [];
    var node = this.root;
    var lastVisitedNode;
    while (parentStack.length || node) {
      if (node) {
        parentStack.push(node);
        node = node.left;
      } else {
        var nextNode = parentStack[parentStack.length - 1];
        if (nextNode.right && lastVisitedNode !== nextNode.right) {
          // if right child exists AND traversing node from left child, move
          // right
          node = nextNode.right;
        } else {
          parentStack.pop();
          visit(nextNode.key);
          lastVisitedNode = nextNode;
        }
      }
    }
  };

  BinarySearchTree.prototype.compare = function (a, b) {
    if (a > b) {
      return 1;
    }
    if (a < b) {
      return -1;
    }
    return 0;
  };

  function deleteNode(node, parent, tree) {
    if (!node.left && !node.right) {
      if (parent) {
        parent.removeChild(node);
      } else {
        tree.root = undefined;
      }
      return;
    }

    if (node.left && !node.right) {
      node.key = node.left.key;
      node.right = node.left.right;
      node.left = node.left.left;
      return;
    }

    if (node.right && !node.left) {
      node.key = node.right.key;
      node.left = node.right.left;
      node.right = node.right.right;
      return;
    }

    // both exist, replace with node minimum from right sub-tree and delete the
    // node from the right sub-tree
    var minParent = findParentOfMinimum(node.right, node);
    var minNode = minParent.left ? minParent.left : minParent.right;
    var newKey = minNode.key;
    deleteNode(minNode, minParent, tree);
    node.key = newKey;
  }

  function findParentOfMinimum(node, parent) {
    if (!node.left) {
      return parent;
    }

    return findParentOfMinimum(node.left, node);
  }

  function Node(key) {
    this.key = key;

    this.left = undefined;
    this.right = undefined;
  }

  Node.prototype.removeChild = function (node) {
    if (this.left === node) {
      this.left = undefined;
    }
    if (this.right === node) {
      this.right = undefined;
    }
  };

  return BinarySearchTree;
}));