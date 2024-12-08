<?php
namespace App\Model;

use App\Service\Config;

class Book
{
    private ?int $id = null;
    private ?string $title = null;
    private ?string $author = null;
    private ?string $description = null;
    private ?int $year = null; // Dodano rok wydania
    private ?string $genre = null; // Dodano gatunek

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): Book
    {
        $this->id = $id;
        return $this;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(?string $title): Book
    {
        $this->title = $title;
        return $this;
    }

    public function getAuthor(): ?string
    {
        return $this->author;
    }

    public function setAuthor(?string $author): Book
    {
        $this->author = $author;
        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): Book
    {
        $this->description = $description;
        return $this;
    }

    public function getYear(): ?int
    {
        return $this->year;
    }

    public function setYear(?int $year): Book
    {
        $this->year = $year;
        return $this;
    }

    public function getGenre(): ?string
    {
        return $this->genre;
    }

    public function setGenre(?string $genre): Book
    {
        $this->genre = $genre;
        return $this;
    }

    public static function fromArray($array): Book
    {
        $book = new self();
        $book->fill($array);

        return $book;
    }

    public function fill($array): Book
    {
        if (isset($array['id']) && !$this->getId()) {
            $this->setId($array['id']);
        }
        if (isset($array['title'])) {
            $this->setTitle($array['title']);
        }
        if (isset($array['author'])) {
            $this->setAuthor($array['author']);
        }
        if (isset($array['description'])) {
            $this->setDescription($array['description']);
        }
        if (isset($array['year'])) {
            $this->setYear((int)$array['year']);
        }
        if (isset($array['genre'])) {
            $this->setGenre($array['genre']);
        }

        return $this;
    }

    public static function findAll(): array
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM book';
        $statement = $pdo->prepare($sql);
        $statement->execute();

        $books = [];
        $booksArray = $statement->fetchAll(\PDO::FETCH_ASSOC);
        foreach ($booksArray as $bookArray) {
            $books[] = self::fromArray($bookArray);
        }

        return $books;
    }

    public static function find($id): ?Book
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM book WHERE id = :id';
        $statement = $pdo->prepare($sql);
        $statement->execute(['id' => $id]);

        $bookArray = $statement->fetch(\PDO::FETCH_ASSOC);
        if (!$bookArray) {
            return null;
        }
        return self::fromArray($bookArray);
    }

    public function save(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        if (!$this->getId()) {
            $sql = "INSERT INTO book (title, author, description, year, genre) VALUES (:title, :author, :description, :year, :genre)";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                'title' => $this->getTitle(),
                'author' => $this->getAuthor(),
                'description' => $this->getDescription(),
                'year' => $this->getYear(),
                'genre' => $this->getGenre(),
            ]);
            $this->setId($pdo->lastInsertId());
        } else {
            $sql = "UPDATE book SET title = :title, author = :author, description = :description, year = :year, genre = :genre WHERE id = :id";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                'title' => $this->getTitle(),
                'author' => $this->getAuthor(),
                'description' => $this->getDescription(),
                'year' => $this->getYear(),
                'genre' => $this->getGenre(),
                'id' => $this->getId(),
            ]);
        }
    }

    public function delete(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = "DELETE FROM book WHERE id = :id";
        $statement = $pdo->prepare($sql);
        $statement->execute(['id' => $this->getId()]);
        $this->setId(null);
        $this->setTitle(null);
        $this->setAuthor(null);
        $this->setDescription(null);
        $this->setYear(null);
        $this->setGenre(null);
    }
}
