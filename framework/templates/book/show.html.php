<?php
$title = 'Book Details: ' . htmlspecialchars($book->getTitle());
$bodyClass = 'book-show';
ob_start();
?>
<h1>Book Details</h1>
<p><strong>Title:</strong> <?php echo htmlspecialchars($book->getTitle()); ?></p>
<p><strong>Author:</strong> <?php echo htmlspecialchars($book->getAuthor()); ?></p>
<p><strong>Year:</strong> <?php echo htmlspecialchars($book->getYear()); ?></p>
<p><strong>Genre:</strong> <?php echo htmlspecialchars($book->getGenre()); ?></p>
<p><strong>Description:</strong> <?php echo htmlspecialchars($book->getDescription()); ?></p>
<a href="<?php echo $router->generatePath('book-index'); ?>">Back to Book List</a>
<?php
$main = ob_get_clean();
require __DIR__ . '/../base.html.php';
