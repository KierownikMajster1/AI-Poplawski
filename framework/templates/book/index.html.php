<?php
$title = 'Book List';
$bodyClass = 'book-index';
ob_start();
?>
<h1>Book List</h1>
<a href="<?php echo $router->generatePath('book-create'); ?>">Add New Book</a>
<ul>
    <?php foreach ($books as $book): ?>
        <li>
            <strong><?php echo htmlspecialchars($book->getTitle()); ?></strong>
            by <?php echo htmlspecialchars($book->getAuthor()); ?>
            <a href="<?php echo $router->generatePath('book-show', ['id' => $book->getId()]); ?>">View</a>
            <a href="<?php echo $router->generatePath('book-edit', ['id' => $book->getId()]); ?>">Edit</a>
            <a href="<?php echo $router->generatePath('book-delete', ['id' => $book->getId()]); ?>">Delete</a>
        </li>
    <?php endforeach; ?>
</ul>
<?php
$main = ob_get_clean();
require __DIR__ . '/../base.html.php';
