using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace My_Stud_Proj.Migrations
{
    /// <inheritdoc />
    public partial class RenameColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Rating",
                table: "FeedbacksList");

            migrationBuilder.AddColumn<int>(
                name: "TotalGrade",
                table: "FeedbacksList",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TotalGrade",
                table: "FeedbacksList");

            migrationBuilder.AddColumn<byte>(
                name: "Rating",
                table: "FeedbacksList",
                type: "tinyint unsigned",
                nullable: false,
                defaultValue: (byte)0);
        }
    }
}
