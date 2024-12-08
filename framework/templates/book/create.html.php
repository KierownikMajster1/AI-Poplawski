<?php
$title = 'Create Book';
$bodyClass = 'book-create';
ob_start();
?>
<h1>Create a New Book</h1>
<form method="POST" action="<?php echo $router->generatePath('book-create'); ?>">
    <label for="title">Title:</label>
    <input type="text" id="title" name="book[title]" required>
    <br>
    <label for="author">Author:</label>
    <input type="text" id="author" name="book[author]" required>
    <br>
    <label for="year">Year:</label>
    <input type="number" id="year" name="book[year]">
    <br>
    <label for="genre">Genre:</label>
    <input type="text" id="genre" name="book[genre]">
    <br>
    <label for="description">Description:</label>
    <textarea id="description" name="book[description]" rows="4"></textarea>
    <br>
    <button type="submit">Save</button>
</form>
<a href="<?php echo $router->generatePath('book-index'); ?>">Back to Book List</a>
<?php
$main = ob_get_clean();
require __DIR__ . '/../base.html.php';
