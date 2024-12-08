<?php
$title = 'Edit Book: ' . htmlspecialchars($book->getTitle());
$bodyClass = 'book-edit';
ob_start();
?>
<h1>Edit Book: <?php echo htmlspecialchars($book->getTitle()); ?></h1>
<form method="POST" action="<?php echo $router->generatePath('book-edit', ['id' => $book->getId()]); ?>">
    <label for="title">Title:</label>
    <input type="text" id="title" name="book[title]" value="<?php echo htmlspecialchars($book->getTitle()); ?>" required>
    <br>
    <label for="author">Author:</label>
    <input type="text" id="author" name="book[author]" value="<?php echo htmlspecialchars($book->getAuthor()); ?>" required>
    <br>
    <label for="year">Year:</label>
    <input type="number" id="year" name="book[year]" value="<?php echo htmlspecialchars($book->getYear()); ?>">
    <br>
    <label for="genre">Genre:</label>
    <input type="text" id="genre" name="book[genre]" value="<?php echo htmlspecialchars($book->getGenre()); ?>">
    <br>
    <label for="description">Description:</label>
    <textarea id="description" name="book[description]" rows="4"><?php echo htmlspecialchars($book->getDescription()); ?></textarea>
    <br>
    <button type="submit">Save</button>
</form>
<a href="<?php echo $router->generatePath('book-index'); ?>">Back to Book List</a>
<?php
$main = ob_get_clean();
require __DIR__ . '/../base.html.php';
