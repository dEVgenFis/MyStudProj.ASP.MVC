using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace My_Stud_Proj.Migrations
{
    /// <inheritdoc />
    public partial class CreateFeedbacksListTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "FeedbacksList",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    DeveloperId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Rating = table.Column<byte>(type: "tinyint unsigned", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FeedbacksList", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "FeedbackDb",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    UserAvatarPath = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    UserName = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    UserGameWinner = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    UserTotalGameAttempts = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    FeedbackGrade = table.Column<byte>(type: "tinyint unsigned", nullable: false),
                    FeedbackText = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    FeedbackUpdate = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    DateTime = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    FeedbacksDbListId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FeedbackDb", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FeedbackDb_FeedbacksList_FeedbacksDbListId",
                        column: x => x.FeedbacksDbListId,
                        principalTable: "FeedbacksList",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_FeedbackDb_FeedbacksDbListId",
                table: "FeedbackDb",
                column: "FeedbacksDbListId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FeedbackDb");

            migrationBuilder.DropTable(
                name: "FeedbacksList");
        }
    }
}
